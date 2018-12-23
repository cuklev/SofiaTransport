const db = (() => {
	let routesList, stopsList;
	const routes = {}, stops = {};
	let subway;

	const cacheSubway = async () => {
		if(subway) return;
		subway = await request.getJSON('cache/subway.json');
	};
	const collectRoutes = (routes) => {
		const result = {};
		routes.forEach(({name, routes}) => result[name] = routes);
		return result;
	};
	const cacheRoutes = async () => {
		if(routesList) return;
		routesList = await request.getJSON('cache/routes.json');
		routesList.forEach(({type, lines}) => routes[type] = collectRoutes(lines));
		await cacheSubway();
		routes.subway = {};
		Object.entries(subway.routes)
			.forEach(([route, codes]) => routes.subway[route] = [{codes}]);
	};
	const cacheStops = async () => {
		if(stopsList) return;
		stopsList = await request.getJSON('cache/stops-bg.json');
		stopsList.forEach(({c, ...rest}) => stops[c] = rest);
	};

	const getStopname = async (code) => {
		await cacheStops();
		while(code.length < 4)
			code = '0' + code;
		return stops[code].n;
	};
	const getLines = async () => {
		await Promise.all([cacheRoutes(), cacheSubway()]);
		return {
			buses: Object.keys(routes.bus),
			trams: Object.keys(routes.tram),
			trolleys: Object.keys(routes.trolley),
			subway: subway.routesList
		};
	};
	const getRoutes = async (type, number) => {
		await Promise.all([cacheRoutes(), cacheStops(), cacheSubway()]);
		const pairWithName = (code) => ({
			code,
			name: stops[code].n,
		});
		return routes[type][number].map(x => x.codes.map(pairWithName));
	};
	// const getPoints = (function(line) {
	const searchStops = async (searchString) => {
		await cacheStops();
		const words = searchString.match(/\S+/g)
			.map(w => w.toUpperCase());
		return stopsList.filter(({n, c}) => {
			const nu = n.toUpperCase();
			return c.indexOf(searchString) >= 0
				|| words.every(w => nu.indexOf(w) >= 0);
		});
	};

	return {
		getStopname,
		getLines,
		getRoutes,
		searchStops,
	};
})();
