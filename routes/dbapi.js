var db = require('../database/database');

function stopname(req, res) {
	var stopcode = req.body.stopcode;
	res.send(db.stops[stopcode]);
}

module.exports = {
	stopname: stopname
};
