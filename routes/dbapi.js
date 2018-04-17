module.exports = (db, router) => {
	const getAllLines = () => ({
		buses: Object.keys(db.routes.bus),
		trams: Object.keys(db.routes.tram),
		trolleys: Object.keys(db.routes.trolley),
	});

	const getStopname = (code) => {
		while(code.length < 4)
			code = '0' + code;
		return db.stops[code].n;
	};

	const getRoutes = (type, number) => {
		const pairWithName = (code) => ({
			code,
			name: getStopname(code),
		});
		return db.routes[type][number].map(x => x.codes.map(pairWithName));
	};

	const searchStops = (searchString) => {
		const words = searchString.match(/\S+/g)
			.map(w => w.toUpperCase());
		return db.stopsList.filter(({n}) => {
			const nu = n.toUpperCase();
			return words.every(w => nu.indexOf(w) >= 0);
		});
	};

	router
		.get('/lines', (req, res) => res.send(getAllLines()))
		.get('/stopname/:code', (req, res) => res.send(getStopname(req.params.code)))
		.get('/routes/:type/:number', (req, res) => res.send(getRoutes(req.params.type, req.params.number)))
		.get('/stops', (req, res) => res.send(searchStops(req.query.s)))
		.get('/points', (req, res) => res.send('No points'));
}
