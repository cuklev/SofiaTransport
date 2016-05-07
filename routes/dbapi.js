var db = require('../database/database');

function stopname(req, res) {
	var stopcode = req.body.stopcode;
	res.send(db.stops[stopcode]);
}

function lines(req, res) {
	res.send({
		trams: Object.keys(db.trams),
		buses: Object.keys(db.buses),
		trolleys: Object.keys(db.trolleys)
	});
};

module.exports = {
	stopname: stopname,
	lines: lines
};
