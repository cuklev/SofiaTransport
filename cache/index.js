const request = require('request');
const fs = require('fs').promises;

const baseUrl = 'https://routes.sofiatraffic.bg/resources';

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
	const response = await get(`${baseUrl}/${file}`);
	await fs.writeFile(`static/cache/${file}`, response);
};

const loadSubway = async () => {
	const response = await get(`https://schedules.sofiatraffic.bg/metro/1`);

	let match;

	const routesList = [];
	const routeRegex = /href="\/metro\/1#direction\/([0-9]*)[^>]*>\s*<span>([^<]*)/g;
	while(match = routeRegex.exec(response)) {
		const [, routeId, routeName] = match;
		routesList.push({routeId, routeName});
	}

	const routes = {};
	const stopRegex = /href="\/metro\/1#sign\/([0-9]*)\/([0-9]*)"[^>]*>([^<]*)/g;
	while(match = stopRegex.exec(response)) {
		const [, routeId, stopCode, stopName] = match;
		if(routes.hasOwnProperty(routeId)) {
			routes[routeId].push(stopCode);
		} else {
			routes[routeId] = [stopCode];
		}
	}

	return {routesList, routes};
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
