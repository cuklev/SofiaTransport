const db = (() => {
	const getAndCache = (() => {
		const cache = {};

		return (url) => new Promise((resolve, reject) => {
			if(cache.hasOwnProperty(url)) {
				resolve(cache[url]);
				return;
			}
			$.get(url, res => {
				cache[url] = res;
				resolve(res);
			});
		});
	})();

	const getStopname = (stopcode) => getAndCache(`api/stopname/${stopcode}`);
	const getLines = () => getAndCache('api/lines');
	const getRoutes = (type, name) => getAndCache(`api/routes/${type}/${name}`);
	// const getPoints = (function(line) {

	return {
		getStopname,
		getLines,
		getRoutes,
	};
})();
