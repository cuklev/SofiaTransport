const router = require('express').Router();

module.exports = (db) => {
	require('./dbapi')(db, router);
	require('./sumcapi')(db, router);
	return router;
};
