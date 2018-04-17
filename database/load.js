const request = require('request');

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

const getRoutes = () => get(`${baseUrl}/routes.json`)
								.then(x => JSON.parse(x))
								.catch(() => getRoutes()); // Abuse server
const getStops = () => get(`${baseUrl}/stops-bg.json`)
								.then(x => JSON.parse(x))
								.catch(() => getStops()); // Abuse server

const collectRoutes = (routes) => {
	const result = {};
	routes.forEach(({name, routes}) => result[name] = routes);
	return result;
};

const load = async () => {
	console.log('Loading DB...');
	const [routesList, stopsList] = await Promise.all([
		getRoutes(),
		getStops()
	]);
	const routes = {}, stops = {};
	routesList.forEach(({type, lines}) => routes[type] = collectRoutes(lines));
	stopsList.forEach(({c, ...rest}) => stops[c] = rest);

	const routesCount = [].concat(...Object.values(routesList).map(x => x.lines)).length;
	const stopsCount = stopsList.length;

	console.log(`Loaded ${routesCount} routes and ${stopsCount} stops`);
	return {routes, stops, stopsList};
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
