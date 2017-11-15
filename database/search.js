const getAll = (lines) => lines.map(x => x.slice());
const getAllLines = (db) => ({
	bus: getAll(db.lines.bus),
	tram: getAll(db.lines.tram),
	trolley: getAll(db.lines.trolley),
});

module.exports = (db) => ({
	getAllLines: () => getAllLines(db),
	getRoutes: (db) => (id) => db.routes[id],
	getStops: (db) => (id) => db.stops[id],
});
