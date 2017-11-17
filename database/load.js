const request = require('request');

const baseUrl = 'https://www.sofiatraffic.bg/interactivecard';

const get = async (url) => {
	const options = {
		method: 'get',
		url
	};

	return await new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if(err) reject(err);
			resolve(body);
		});
	});
};

const getLines = (type) => get(`${baseUrl}/lines/${type}`)
								.then(x => x.split(/<label for="line/g)
												.filter((_, i) => i)
												.map(x => x.split(/">[^0-9]*|</g)
																.slice(0, 2)));
const getRoutes = (id) => get(`${baseUrl}/lines/geo?line_id=${id}`)
								.then(x => JSON.parse(x).features)
								.catch(() => getRoutes(id)); // Abuse server
const getStops = (id) => get(`${baseUrl}/lines/stops/geo?line_id=${id}`)
								.then(x => JSON.parse(x).features)
								.catch(() => getStops(id)); // Abuse server

const loadLine = (routes, stops, id) => Promise.all([
	getRoutes(id).then(x => routes[id] = x),
	getStops(id).then(x => stops[id] = x.map(x => ({
		id: x.id,
		code: x.properties.code,
		name: x.properties.name,
		coordinates: x.geometry.coordinates,
	})))
]);

const load = async () => {
	console.log('Loading DB...');
	const lines = await Promise.all([1, 2, 3].map(getLines));

	const db = {
		lines: {
			buses: lines[0],
			trams: lines[1],
			trolleys: lines[2],
		},
		routes: {},
		stops: {},
	};

	await Promise.all([].concat(...lines)
			.map(([id]) => loadLine(db.routes, db.stops, id)));

	console.log('Loaded');
	return db;
};

const setReload = (db, timeout) => {
	const reload = () => load()
		.then(x => Object.assign(db, x))
		.then(() => setTimeout(reload, timeout));
	reload();
};

module.exports = {
	load,
	setReload,
};
