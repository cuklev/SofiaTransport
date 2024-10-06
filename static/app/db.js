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

	return {
		getLines,
		getStops,
	};
})();
