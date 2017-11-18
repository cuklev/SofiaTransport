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

const loadLine = (id) => Promise.all([
	getRoutes(id).then(x => x),
	getStops(id).then(x => x.map(x => ({
		id: x.id,
		code: x.properties.code,
		name: x.properties.name,
		coordinates: x.geometry.coordinates,
	})))
]);

const loadType = async (id) => {
	const lines = await getLines(id);
	await Promise.all(lines.map(async x => {
		const id = x[0],
			routesPromise = getRoutes(id),
			stopsPromise = getStops(id);
		x[2] = await routesPromise;
		x[3] = await stopsPromise;
	}));
	return lines;
};

const load = async () => {
	console.log('Loading DB...');
	const data = await Promise.all([1, 2, 3].map(loadType));

	const db =  {
		lines: {
			buses: data[0].map(x => x.slice(0, 2)),
			trams: data[1].map(x => x.slice(0, 2)),
			trolleys: data[2].map(x => x.slice(0, 2)),
		},
		routes: {},
		stops: {},
	};

	[].concat(...data)
		.forEach(x => {
			db.routes[x[0]] = x[2];
			db.stops[x[0]] = x[3];
		});

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
