const fs = (() => {
	const fs1 = require('fs');
	if(fs1.promises) {
		return fs1.promises;
	}
	// Node < 10 does not have fs.promises
	return {
		writeFile: (file, body) => new Promise((resolve, reject) => fs1.writeFile(file, body, err => err ? reject(err) : resolve())),
		mkdir: (dir, opts) => new Promise((resolve, reject) => fs1.mkdir(dir, opts, err => err ? reject(err) : resolve())),
	};
})();

const get = async (url) => {
	const res = await fetch(url);
	if (!res.ok) {
		throw res.statusText;
	}
	return res;
};

const getText = async (url) => {
	const res = await get(url);
	return res.text();
};

const getJson = async (url) => {
	const res = await get(url);
	return res.json();
};

const loadSubwayRoutes = async (subwayName) => {
	const response = await getText(`https://schedules.sofiatraffic.bg/metro/${subwayName}`);

	let match;

	const schedules = {
		weekday: response.match(/id="schedule_([0-9]*)_content"[^>]*>\n\s*<h3>делник/)[1],
		weekend: response.match(/id="schedule_([0-9]*)_content"[^>]*>\n\s*<h3>предпразник/)[1],
	};

	const routes = {};
	const routeNames = {};
	const routeRegex = RegExp(`href="\/metro\/${subwayName}#direction\/([0-9]*)[^>]*>\\s*<span>([^<]*)`, 'g');
	while(match = routeRegex.exec(response)) {
		const [, id, name] = match;
		routes[id] = [{codes: []}];
		routeNames[id] = name;
	}

	const stopRegex = /id="schedule_([0-9]*)_direction_([0-9]*)_sign_([0-9]*)_stop"/g;
	while(match = stopRegex.exec(response)) {
		const [, schedule, route, stopCode] = match;
		if(schedule !== schedules.weekday) {
			continue;
		}
		if(!routes.hasOwnProperty(route)) {
			console.error(`Subway has no route ${route}!`);
		} else {
			routes[route][0].codes.push(stopCode);
		}
	}

	return {schedules, routes, routeNames};
};

const loadSubwayTimetables = async (schedules, routes) => {
	const timetables = {weekday: {}, weekend: {}};
	for(const schedName in schedules) {
		for(const route in routes) {
			const routeId = route.replace(/;.*/, '');
			for(const stopCode of routes[route][0].codes) {
				console.log(`Downloading subway timetable for ${schedName}/${routeId}/${stopCode}`);
				if(!timetables[schedName].hasOwnProperty(stopCode)) {
					timetables[schedName][stopCode] = {};
				}
				const response = await getText(`https://schedules.sofiatraffic.bg/server/html/schedule_load/${schedules[schedName]}/${routeId}/${stopCode}`);
				timetables[schedName][stopCode][routeId] = response.match(/[0-9]{1,2}:[0-9]{2}/g);
			}
		}
	}

	return timetables;
};

const loadSubway = async (subwayLine) => {
	const subway = await loadSubwayRoutes(subwayLine);
	subway.timetables = await loadSubwayTimetables(subway.schedules, subway.routes);
	return subway;
}

const getAllSubwayLines = async () => {
	const response = await getText(`https://schedules.sofiatraffic.bg/`);
	const regex = /href="metro\/([^"]*)"/g;
	const lines = new Set;
	let match;
	while(match = regex.exec(response)) {
		lines.add(match[1]);
	}
	return lines;
}

const load = async () => {
	await fs.mkdir('static/cache', {recursive: true});

	const collect = routes => routes.reduce((r, {name, routes}) => Object.assign(r, {[name]: routes}), {});
	const routes = await getJson(`https://routes.sofiatraffic.bg/resources/routes.json`)
		.reduce((r, {type, lines}) => Object.assign(r, {[type]: collect(lines)}), {});

	routes.subway = {};
	routes.subwayNames = {};
	const subwayTimetables = {weekday: {}, weekend: {}};
	const subwayLines = await getAllSubwayLines();
	for(const subwayLine of subwayLines) {
		const subway = await loadSubway(subwayLine);
		Object.assign(routes.subway, subway.routes);
		Object.assign(routes.subwayNames, subway.routeNames);
		Object.assign(subwayTimetables.weekday, subway.timetables.weekday);
		Object.assign(subwayTimetables.weekend, subway.timetables.weekend);
	}

	await fs.writeFile(`static/cache/routes.json`, JSON.stringify(routes));
	console.log('Cached routes.json');

	const stops = await getJson(`https://routes.sofiatraffic.bg/resources/stops-bg.json`)
		.reduce((r, {c, ...rest}) => Object.assign(r, {[c]: rest}), {});
	await fs.writeFile(`static/cache/stops-bg.json`, JSON.stringify(stops));
	console.log('Cached stops-bg.json');

	await fs.writeFile(`static/cache/subway-timetables.json`, JSON.stringify(subwayTimetables));
	console.log('Cached subway-timetables.json');
};

module.exports = load;
