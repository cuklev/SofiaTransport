const request = require('request');

const baseUrl = 'https://www.sofiatraffic.bg/interactivecard';

const get = (url) => {
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

const getLines = (type) => get(`${baseUrl}/lines/${type}`)
								.then(x => x.split(/<label for="line/g)
												.filter((_, i) => i)
												.map(x => x.split(/[^0-9]+/g)
																.slice(0, 2)));
const getRoutes = (id) => get(`${baseUrl}/lines/geo?line_id=${id}`)
								.then(x => JSON.parse(x).features)
								.catch(() => getRoutes(id)); // Abuse server
const getStops = (id) => get(`${baseUrl}/lines/stops/geo?line_id=${id}`)
								.then(x => JSON.parse(x).features)
								.catch(() => getStops(id)); // Abuse server

const db = {};

const loadLine = (id) => Promise.all([
	getRoutes(id).then(x => db.routes.push(x)),
	getStops(id).then(stops => db.stops[id] = stops.map(x => ({
		id: x.id,
		code: x.properties.code,
		name: x.properties.name,
		coordinates: x.geometry.coordinates,
	})))
]);

const loadTransport = (id) => getLines(id)
	.then(async lines => {
		await Promise.all(lines.map(x => loadLine(x[0])));
		return lines;
	});

const load = () => {
	db.routes = [];
	db.stops = [];

	return Promise.all([1, 2, 3].map(loadTransport))
		.then(([bus, tramway, trolley]) => db.lines = { bus, tramway, trolley });
}

load().then(() => {
	console.log(db.stops[3614][0]);
});

module.exports = db;
