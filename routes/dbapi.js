var db = require('../database/database');

function stopname(req, res) {
	var stopcode = req.body.stopcode;
	res.send(db.stops[stopcode]);
}

function lines(req, res) {
	res.send({
		trams: db.trams.all,
		buses: db.buses.all,
		trolleys: db.trolleys.all
	});
};

module.exports = {
	stopname: stopname,
	lines: lines
};
