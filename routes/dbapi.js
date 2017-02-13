const db = require('../database');

function stopname(req, res) {
	const stopcode = req.query.stopcode;
	res.send(db.stops[stopcode]);
}

function lines(req, res) {
	res.send({
		trams: db.trams.all,
		buses: db.buses.all,
		trolleys: db.trolleys.all
	});
};

function routes(req, res) {
	const linetype = req.query.linetype;
	const linename = req.query.linename;

	const routes = [db.trams, db.buses, db.trolleys][linetype].routes[linename];
	res.send(routes);
}

function points(req, res) {
	res.send('No points');
//	var linetype = req.query.linetype;
//	var linename = req.query.linename;

//	var points = [db.trams, db.buses, db.trolleys][linetype].points;
//	res.send(points);
}

module.exports = {
	stopname,
	lines,
	routes,
	points
};
