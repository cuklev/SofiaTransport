const request = require('request');

const baseUrl = 'http://drone.sumc.bg/api/v1';

function timingHandler(req, res) {
	const url = baseUrl + '/timing';

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

function timetableHandler(req, res) {
	const url = baseUrl + '/timetable';

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
	const url = baseUrl + '/config';

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
	timetableHandler: timetableHandler,
	datetimeHandler: datetimeHandler
};
