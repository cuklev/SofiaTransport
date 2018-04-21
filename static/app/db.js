const db = (() => {
	const getAndCache = (() => {
		const cache = {};

		return async (url) => {
			if(cache.hasOwnProperty(url)) {
				return cache[url];
			}
			const res = await request.getJSON(url);
			cache[url] = res;
			return res;
		};
	})();

	const getStopname = (stopcode) => getAndCache(`api/stopname/${stopcode}`);
	const getLines = () => getAndCache('api/lines');
	const getRoutes = (type, name) => getAndCache(`api/routes/${type}/${name}`);
	// const getPoints = (function(line) {
	const searchStops = (str) => request.getJSON(`api/stops?s=${str}`);

	return {
		getStopname,
		getLines,
		getRoutes,
		searchStops,
	};
})();
