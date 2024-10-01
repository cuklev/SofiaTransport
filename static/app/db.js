const db = (() => {
	const getAndCache = (url) => {
		let cache;
		return async () => {
			if(!cache) {
				cache = await request.getJSON(url);
			}
			return cache;
		};
	};
	const getLines = getAndCache('cache/lines.json');
	const getStops = getAndCache('cache/stops.json');
	const getRoutes = getAndCache('cache/routes.json');

	const getLineRoutes = async (type, number) => {
		const [routes, stops] = await Promise.all([getRoutes(), getStops()]);
		const pairWithName = (code) => ({
			code,
			name: stops[code] ? stops[code].n : 0,
		});
		return routes[type][number].map(x => x.codes.map(pairWithName).filter(x => x.name));
	};

	return {
		getLines,
		getStops,
		getLineRoutes,
	};
})();
