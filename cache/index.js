const request = require('request');
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
	const options = {
		method: 'get',
		url
	};

	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if(err) reject(err);
			resolve(body);
		});
	});
};

const loadSubwayRoutes = async () => {
	const subwayName = 'M1-M2';
	const response = await get(`https://schedules.sofiatraffic.bg/metro/${subwayName}`);

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
				const response = await get(`https://schedules.sofiatraffic.bg/server/html/schedule_load/${schedules[schedName]}/${routeId}/${stopCode}`);
				timetables[schedName][stopCode][routeId] = response.match(/[0-9]{1,2}:[0-9]{2}/g);
			}
		}
	}

	return timetables;
};

const load = async () => {
	await fs.mkdir('static/cache', {recursive: true});

	const collect = routes => routes.reduce((r, {name, routes}) => Object.assign(r, {[name]: routes}), {});
	const routes = JSON.parse(await get(`https://routes.sofiatraffic.bg/resources/routes.json`))
		.reduce((r, {type, lines}) => Object.assign(r, {[type]: collect(lines)}), {});

	const subway = await loadSubwayRoutes();
	routes.subway = subway.routes;
	routes.subwayNames = subway.routeNames;

	await fs.writeFile(`static/cache/routes.json`, JSON.stringify(routes));
	console.log('Cached routes.json');

	const stops = JSON.parse(await get(`https://routes.sofiatraffic.bg/resources/stops-bg.json`))
		.reduce((r, {c, ...rest}) => Object.assign(r, {[c]: rest}), {});
	await fs.writeFile(`static/cache/stops-bg.json`, JSON.stringify(stops));
	console.log('Cached stops-bg.json');

	const subwayTimetables = await loadSubwayTimetables(subway.schedules, subway.routes);
	await fs.writeFile(`static/cache/subway-timetables.json`, JSON.stringify(subwayTimetables));
	console.log('Cached subway-timetables.json');
};

module.exports = load;
