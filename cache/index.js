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

const cacheFile = async (file) => {
	const response = await get(`https://routes.sofiatraffic.bg/resources/${file}`);
	await fs.writeFile(`static/cache/${file}`, response);
};

const loadSubwayRoutes = async () => {
	const response = await get(`https://schedules.sofiatraffic.bg/metro/1`);

	let match;

	const schedules = {
		weekday: response.match(/id="schedule_([0-9]*)_content"[^>]*>\n\s*<h3>делник/)[1],
		weekend: response.match(/id="schedule_([0-9]*)_content"[^>]*>\n\s*<h3>предпразник/)[1],
	};

	const routes = {};
	const routeRegex = /href="\/metro\/1#direction\/([0-9]*)[^>]*>\s*<span>([^<]*)/g;
	while(match = routeRegex.exec(response)) {
		const [, id, name] = match;
		routes[id] = {name};
	}

	const stopRegex = /id="schedule_([0-9]*)_direction_([0-9]*)_sign_([0-9]*)_stop"/g;
	while(match = stopRegex.exec(response)) {
		const [, schedule, route, stopCode] = match;
		if(schedule !== schedules.weekday) {
			continue;
		}
		if(!routes.hasOwnProperty(route)) {
			console.error(`Subway has no route ${route}!`);
		} else if(routes[route].hasOwnProperty('codes')) {
			routes[route].codes.push(stopCode);
		} else {
			routes[route].codes = [stopCode];
		}
	}

	return {schedules, routes};
};

const loadSubwayTimetables = async (schedules, routes) => {
	const timetables = {weekday: {}, weekend: {}};
	for(const schedName in schedules) {
		for(const route in routes) {
			for(const stopCode of routes[route].codes) {
				console.log(`Downloading subway timetable for ${schedName}/${route}/${stopCode}`);
				if(!timetables[schedName].hasOwnProperty(stopCode)) {
					timetables[schedName][stopCode] = {};
				}
				const response = await get(`https://schedules.sofiatraffic.bg/server/html/schedule_load/${schedules[schedName]}/${route}/${stopCode}`);
				timetables[schedName][stopCode][route] = response.match(/[0-9]{1,2}:[0-9]{2}/g);
			}
		}
	}

	return timetables;
};

const load = async () => {
	await fs.mkdir('static/cache', {recursive: true});
	await cacheFile('routes.json');
	console.log('Cached routes.json');
	await cacheFile('stops-bg.json');
	console.log('Cached stops-bg.json');

	const {schedules: subwaySchedules, routes: subwayRoutes} = await loadSubwayRoutes();
	const subway = {
		routes: subwayRoutes,
		timetables: await loadSubwayTimetables(subwaySchedules, subwayRoutes),
	};
	await fs.writeFile(`static/cache/subway.json`, JSON.stringify(subway));
	console.log('Cached subway.json');
};

const setReload = (timeout) => {
	const reload = () => load()
		.then(() => setTimeout(reload, timeout));
	reload();
};

module.exports = {
	load,
	setReload,
};
