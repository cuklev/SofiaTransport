const request = require('request');

function timingHandler(req, res) {
	const url = 'http://drone.sumc.bg/api/v1/timing';

	const options = {
		method: 'post',
		body: req.query,
		json: true,
		url: url
	};

	// Maybe implement caching

	request(options, function (err, res1, body) {
		if(err) {
			console.error('Error:', err);
			return;
		}

		res.send(body);
	});
}

function datetimeHandler(req, res) {
	const url = 'http://drone.sumc.bg/api/v1/config';

	const options = {
		method: 'get',
		url: url
	};

	request(options, function (err, res1, body) {
		if(err) {
			console.error('Error:', err);
			return;
		}

		body = body.replace(/^.*date":"([^"]*)".*$/, '$1');
		res.send(body);
	});
}

module.exports = {
	timingHandler: timingHandler,
	datetimeHandler: datetimeHandler
};
