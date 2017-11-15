module.exports = (db, router) => router
	.get('/stopname', (req, res) => res.send('No name'))
	.get('/lines', (req, res) => res.send(db.getAllLines()))
	.get('/routes', (req, res) => res.send(db.getRoutes(req.query.lineid)))
	.get('/stops', (req, res) => res.send(db.getStops(req.query.lineid)))
	.get('/points', (req, res) => res.send('No points'));
