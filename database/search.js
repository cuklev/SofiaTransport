const getAll = (lines) => lines.map(x => x.slice());
const getAllLines = (db) => ({
	buses: getAll(db.lines.buses),
	trams: getAll(db.lines.trams),
	trolleys: getAll(db.lines.trolleys),
});

module.exports = (db) => ({
	getAllLines: () => getAllLines(db),
	getRoutes: (id) => db.routes[id],
	getStops: (id) => db.stops[id],
});
