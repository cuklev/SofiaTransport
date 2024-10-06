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

	const text = await result.text();
	res.send(text);
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

const routesHandler = async (req, res) => {
	const {type, name} = req.params;
	const typeNum = transportTypes[type] || type;

	const key = `${typeNum}@${name}`;
	if (!routesCache.has(key)) {
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
		const routes = data.routes.map(route => ({
			name: route.name,
			stops: route.segments.map(segment => segment.stop.code)
		}));

		routesCache.set(key, JSON.stringify(routes));
	}
	res.send(routesCache.get(key));
};

module.exports = router => router
	.get('/timing/:code', timingHandler)
	.get('/route/:type/:name', routesHandler);
