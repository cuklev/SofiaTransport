const request = require('request');

const baseUrl = 'http://drone.sumc.bg/api/v1';

const forwardResponse = (options, send) => request(options, (err, res, body) => {
	if(err) {
		console.error(`Error: ${err}`);
		return;
	}

	send(body);
});

const getToPost = (url) => (req, res) => {
	const options = {
		method: 'post',
		body: req.query,
		json: true,
		url
	};

	forwardResponse(options, res.send);
};

const getToGet = (url) => (req, res) => {
	const options = {
		method: 'get',
		url
	};

	forwardResponse(options, res.send);
};

const timingHandler = getToPost(`${baseUrl}/timing`);
const timetableHandler = getToPost(`${baseUrl}/timetable`);
const subwayRoutesHandler = getToGet(`${baseUrl}/metro/all`);

// TODO: remove duplicated code
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

// TODO: remove duplicated code
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
	timingHandler,
	timetableHandler,
	subwayRoutesHandler,
	subwayTimetableHandler,
	datetimeHandler
};
