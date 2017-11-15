const getAll = (lines) => lines.map(x => x.slice);
const getAllLines = (db) => ({
	bus: getAll(db.bus),
	tram: getAll(db.tram),
	trolley: getAll(db.trolley),
});

module.exports = (db) => ({
	getAllLines: () => getAllLines(db),
	getRoutes: (db) => (id) => db.routes[id],
	getStops: (db) => (id) => db.stops[id],
});
