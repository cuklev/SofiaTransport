const request = require('request');

const baseUrl = 'http://drone.sumc.bg/api/v1';

const timingHandler = (function() {
	const url = baseUrl + '/timing';

	return function(req, res) {
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
}());

const timetableHandler = (function() {
	const url = baseUrl + '/timetable';

	return function(req, res) {
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
}());

const subwayRoutesHandler = (function() {
	const url = baseUrl + '/metro/all';
	const options = {
		method: 'get',
		url: url
	};

	return function(req, res) {
		request(options, function(err, res1, body) {
			if(err) {
				console.error('Error:', err);
				return;
			}

			res.send(body);
		});
	}
}());

const subwayTimetableHandler = (function() {
	const url = baseUrl + '/metro/times/';

	return function(req, res) {
		const options = {
			method: 'get',
			url: url + req.query.id
		};

		request(options, function(err, res1, body) {
			if(err) {
				console.error('Error:', err);
				return;
			}

			res.send(body);
		});
	}
}());

const datetimeHandler = (function() {
	const url = baseUrl + '/config';
	const options = {
		method: 'get',
		url: url
	};

	return function(req, res) {
		request(options, function (err, res1, body) {
			if(err) {
				console.error('Error:', err);
				return;
			}

			body = body.replace(/^.*date":"([^"]*)".*$/, '$1');
			res.send(body);
		});
	}
}());

module.exports = {
	timingHandler: timingHandler,
	timetableHandler: timetableHandler,
	subwayRoutesHandler: subwayRoutesHandler,
	subwayTimetableHandler: subwayTimetableHandler,
	datetimeHandler: datetimeHandler
};
