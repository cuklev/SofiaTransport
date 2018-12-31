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
	const getRoutes = getAndCache('cache/routes.json');
	const getStops = getAndCache('cache/stops-bg.json');
	const getSubway = getAndCache('cache/subway-timetables.json');

	const getStopname = async (code) => {
		const stops = await getStops();
		while(code.length < 4)
			code = '0' + code;
		return stops[code].n;
	};
	const getLines = async () => {
		const routes = await getRoutes();
		return {
			buses: Object.keys(routes.bus),
			trams: Object.keys(routes.tram),
			trolleys: Object.keys(routes.trolley),
			subway: Object.entries(routes.subwayNames)
				.map(([id, name]) => ({id, name})),
		};
	};
	const getLineRoutes = async (type, number) => {
		const [routes, stops] = await Promise.all([getRoutes(), getStops()]);
		const pairWithName = (code) => ({
			code,
			name: stops[code].n,
		});
		return routes[type][number].map(x => x.codes.map(pairWithName));
	};
	// const getPoints = (function(line) {
	const searchStops = async (searchString) => {
		const stops = await getStops();
		const words = searchString.match(/\S+/g)
			.map(w => w.toUpperCase());
		return Object.entries(stops)
			.map(([c, {n}]) => ({c, n}))
			.filter(({n, c}) => {
			const nu = n.toUpperCase();
			return c.indexOf(searchString) >= 0
				|| words.every(w => nu.indexOf(w) >= 0);
		});
	};

	const timeToInt = time => {
		const [hours, minutes] = time.split(':');
		return hours * 60 + +minutes;
	};
	const getSubwayTimetable = async (code) => {
		const [routes, stops, subway] = await Promise.all([getRoutes(), getStops(), getSubway()]);

		// if your clock is wrong... sorry
		const now = new Date;
		// get yesterday's timetable if it is before 2:00
		const earlierDay = new Date(now - 1000 * 3600 * 2).getDay();
		const nowInt = now.getHours() * 60 + now.getMinutes();
		const laterInt = nowInt + 60; // Show timetable for one hour from now

		const timetableVariant = (earlierDay === 0 || earlierDay === 6) ? 'weekend' : 'weekday';
		if(!subway[timetableVariant].hasOwnProperty(code)) {
			return;
		}

		const lines = Object.entries(subway[timetableVariant][code])
			.map(([route, times]) => {
				const timesAsInt = times
					.map(timeToInt)
					// Adjust times after 23:59
					.map((t, i, ts) => (i > 0 && ts[i - 1] > t) ? t + 24 * 60 : t);
				const arrivals = times.filter((_, i) => nowInt <= timesAsInt[i] && timesAsInt[i] < laterInt)
					.map(time => ({time}));
				return {
					arrivals,
					name: routes.subwayNames[route],
					vehicle_type: 'subway',
				};
			});
		return {
			name: stops[code].n,
			code,
			lines,
			timestamp_calculated: now.toISOString().replace(/T/, ' ').replace(/\..*/, ''),
		};
	};

	return {
		getStopname,
		getLines,
		getLineRoutes,
		searchStops,
		getSubwayTimetable,
	};
})();
