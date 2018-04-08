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

	router
		.get('/lines', (req, res) => res.send(getAllLines()))
		.get('/stopname/:code', (req, res) => res.send(getStopname(req.params.code)))
		.get('/routes/:type/:number', (req, res) => res.send(getRoutes(req.params.type, req.params.number)))
		.get('/stops', (req, res) => res.send('No stops'))
		.get('/points', (req, res) => res.send('No points'));
}
