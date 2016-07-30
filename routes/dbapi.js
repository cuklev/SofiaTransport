const db = require('../database/database');

function stopname(req, res) {
	let stopcode = req.body.stopcode;
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
	let linetype = req.body.linetype;
	let linename = req.body.linename;

	let routes = [db.trams, db.buses, db.trolleys][linetype].routes[linename];
	res.send(routes);
}

function points(req, res) {
	res.send('No points');
//	var linetype = req.body.linetype;
//	var linename = req.body.linename;

//	var points = [db.trams, db.buses, db.trolleys][linetype].points;
//	res.send(points);
}

module.exports = {
	stopname: stopname,
	lines: lines,
	routes: routes,
	points: points
};
