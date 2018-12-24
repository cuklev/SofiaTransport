const request = require('request');
const fs = require('fs').promises;

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

const loadSubwayStopTimetable = async (schedule, route, stopCode) => {
	const response = await get(`https://schedules.sofiatraffic.bg/server/html/schedule_load/${schedule}/${route}/${stopCode}`);
	return response.match(/[0-9]{1,2}:[0-9]{2}/g);
};

const loadSubway = async () => {
	const response = await get(`https://schedules.sofiatraffic.bg/metro/1`);

	let match;

	const routes = {};
	const routeRegex = /href="\/metro\/1#direction\/([0-9]*)[^>]*>\s*<span>([^<]*)/g;
	while(match = routeRegex.exec(response)) {
		const [, id, name] = match;
		routes[id] = {name};
	}

	const stopRegex = /href="\/metro\/1#sign\/([0-9]*)\/([0-9]*)"[^>]*>([^<]*)/g;
	while(match = stopRegex.exec(response)) {
		const [, route, stopCode, stopName] = match;
		if(!routes.hasOwnProperty(route)) {
			console.error(`Subway has no route ${route}!`);
		} else if(routes[route].hasOwnProperty('codes')) {
			routes[route].codes.push(stopCode);
		} else {
			routes[route].codes = [stopCode];
		}
	}

	// TODO: keep 2 timetables
	const timetables = {};
	for(const route in routes) {
		for(const stopCode of routes[route].codes) {
			console.log(`Downloading subway timetable for ${route}/${stopCode}`);
			if(!timetables.hasOwnProperty(stopCode)) {
				timetables[stopCode] = {};
			}
			// 6621 is for weekdays at the moment
			timetables[stopCode][route] = await loadSubwayStopTimetable(6621, route, stopCode);
		}
	}

	return {routes, timetables};
};

const load = async () => {
	await fs.mkdir('static/cache', {recursive: true});
	await cacheFile('routes.json');
	console.log('Cached routes.json');
	await cacheFile('stops-bg.json');
	console.log('Cached stops-bg.json');

	const subway = await loadSubway();
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
