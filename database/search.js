const getAll = (lines) => lines.map(x => x.slice());
const getAllLines = (db) => ({
	buses: getAll(db.lines.buses),
	trams: getAll(db.lines.trams),
	trolleys: getAll(db.lines.trolleys),
});

module.exports = (db) => ({
	getAllLines: () => getAllLines(db),
	getRoutes: (db) => (id) => db.routes[id],
	getStops: (db) => (id) => db.stops[id],
});
