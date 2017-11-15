const load = require('./load');

const db = {};
// Must move as a parameter ->
load(db).setReload(24 * 60 * 60 * 10000); // A day

module.exports = {
};
