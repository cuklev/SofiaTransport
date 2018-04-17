const load = require('./load');

const db = {
	routes: {},
	stops: {},
};

// Must move timeout as a parameter ->
load.setReload(db, 24 * 60 * 60 * 1000); // A day

module.exports = db;
