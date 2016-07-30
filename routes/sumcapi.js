const request = require('request');

function timingHandler(req, res) {
	let url = 'http://drone.sumc.bg/api/v1/timing';

	let options = {
		method: 'post',
		body: req.body,
		json: true,
		url: url
	};

	// Maybe implement caching

	request(options, function (err, res1, body) {
		if(err) {
			console.log('Error:', err);
			return;
		}

		res.send(body);
	});
}

function datetimeHandler(req, res) {
	let url = 'http://drone.sumc.bg/api/v1/config';

	let options = {
		method: 'get',
		url: url
	};

	request(options, function (err, res1, body) {
		if(err) {
			console.log('Error:', err);
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
