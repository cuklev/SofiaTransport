const router = require('express').Router();

module.exports = () => {
	require('./sumcapi')(router);
	return router;
};
