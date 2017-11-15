const load = require('./load');
const search = require('./search');

const db = {
	lines: {
		bus: [],
		tram: [],
		trolley: [],
	},
	routes: {},
	stops: {},
};

// Must move timeout as a parameter ->
load.setReload(db, 24 * 60 * 60 * 10000); // A day

module.exports = search(db);
