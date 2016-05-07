var database = require('./app_database');

var trams = {},
    buses = {},
    trolleys = {},
	stops = {};

database.forEach(function(x) {
	var transport = [trams, buses, trolleys][x.linetype];
	if(!transport.hasOwnProperty(x.linename)) {
		transport[x.linename] = [];
	}
	transport[x.linename].push(x.routename);

	x.points.forEach(function(x) {
		if(x.stopcode === 0) {
			// ignore this for now, it is used just points between stops
			return;
		}
		stops[x.stopcode] = x.stopname;
		// different stopnames may exist for one stopcode
		// because someone's job is to make typos
		// whatever
	});
});

module.exports = {
	trams: trams,
	buses: buses,
	trolleys: trolleys,
	stops: stops
};
