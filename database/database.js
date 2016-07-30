const database = require('./raw_database');

// Will add points later
let trams = {all: [], routes: []}, //, points: []},
	buses = {all: [], routes: []}, //, points: []},
	trolleys = {all: [], routes: []}, //, points: []},
	stops = {};

database.forEach(function(x) {
	var route = {
		routename: x.routename,
		routestops: []
	};
//	var points = {
//		routename: x.routename,
//		routepoints: []
//	};

	x.stops.forEach(function(x) {
		if(x.stopcode !== 0) {
			stops[x.stopcode] = x.stopname;
			// different stopnames may exist for one stopcode
			// because someone's job is to make typos
			// whatever

			route.routestops.push({
				stopcode: x.stopcode,
				stopname: x.stopname
			});
		}
		
//		points.routepoints.push({
//			lat: x.lat,
//			lon: x.lon,
//			stopcode: x.stopcode,
//			stopname: x.stopname
//		});
	});

	const transport = [trams, buses, trolleys][x.linetype];

	if(!transport.routes.hasOwnProperty(x.linename)) {
		transport.routes[x.linename] = [];
//		transport.points[x.linename] = [];
	}

	transport.routes[x.linename].push(route);
//	transport.points[x.linename].push(points);
});

trams.all = Object.keys(trams.routes);
buses.all = Object.keys(buses.routes);
trolleys.all = Object.keys(trolleys.routes);

module.exports = {
	trams: trams,
	buses: buses,
	trolleys: trolleys,
	stops: stops
};
