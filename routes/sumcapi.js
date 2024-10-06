const {getSessionHeaders, getExtId, getStopType} = require('../cache');

const timingUrl = 'https://www.sofiatraffic.bg/bg/trip/getVirtualTable';
const timingHandler = async (req, res) => {
	const code = req.params.code;
	const result = await fetch(timingUrl, {
		method: 'POST',
		headers: getSessionHeaders(),
		body: JSON.stringify({
			stop: code,
			type: getStopType(code)
		})
	});
	if (!result.ok) {
		console.error(`Error: ${result.statusText}`);
		throw res.statusText;
	}

	const timings = await result.json();
	for (const timing of Object.values(timings)) {
		const {route_id, type, name} = timing;
		if (type === transportTypes.subway) {
			const routes = await getRoutesCached(type, name);
			const found = routes.find(r => r.id === route_id);
			if (found) {
				timing.route_name = found.name;
			}
		}
	}
	res.send(JSON.stringify(timings));
};

const schedulesUrl = 'https://www.sofiatraffic.bg/bg/trip/getSchedule'

const transportTypes = {
	bus: 1,
	tram: 2,
	subway: 3,
	trolley: 4,
	nightbus: 5
};

const routesCache = new Map;
setInterval(() => routesCache.clear(), 191*60*1000); // clear routes cache every ~3 hours

const getRoutesCached = async (typeNum, name) => {
	const key = `${typeNum}@${name}`;
	if (routesCache.has(key)) {
		return routesCache.get(key);
	}

	const result = await fetch(schedulesUrl, {
		method: 'POST',
		headers: getSessionHeaders(),
		body: JSON.stringify({
			ext_id: getExtId(typeNum, name)
		})
	});
	if (!result.ok) {
		console.error(`Error: ${result.statusText}`);
		throw res.statusText;
	}

	const data = await result.json();
	const routes = data.routes.map(route => {
		let {id, name} = route;
		if (typeNum == transportTypes.subway) {
			const firstStop = route.segments[0].stop.name;
			const lastStop = route.segments[route.segments.length-1].stop.name;
			name = `${firstStop} - ${lastStop}`;
		}
		return {
			id,
			name,
			stops: route.segments.map(segment => segment.stop.code)
		};
	});

	routesCache.set(key, routes);
	return routes;
};

const routesHandler = async (req, res) => {
	const {type, name} = req.params;
	const typeNum = transportTypes[type] || type;
	const routes = await getRoutesCached(typeNum, name);
	res.send(JSON.stringify(routes));
};

module.exports = router => router
	.get('/timing/:code', timingHandler)
	.get('/route/:type/:name', routesHandler);
