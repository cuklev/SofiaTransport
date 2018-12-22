const request = require('request');

const oldBaseUrl = 'http://drone.sumc.bg/api/v1';

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

	forwardResponse(options, res.send.bind(res));
};

const getToGet = (url) => (req, res) => {
	const options = {
		method: 'get',
		url
	};

	forwardResponse(options, res.send.bind(res));
};

const timingUrl = 'https://api-arrivals.sofiatraffic.bg/api/v1/arrivals';
const timingHandler = (req, res) => {
	const code = req.params.code;
	const options = {
		method: 'get',
		url: `${timingUrl}/${code}/`,
	};
	forwardResponse(options, res.send.bind(res));
};

// OLD API!!!
const timetableHandler = getToPost(`${oldBaseUrl}/timetable`);
// OLD API!!!
const subwayRoutesHandler = getToGet(`${oldBaseUrl}/metro/all`);

// TODO: remove duplicated code
// OLD API!!!
const subwayTimetableHandler = (function() {
	const url = oldBaseUrl + '/metro/times/';

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
// OLD API!!!
const datetimeHandler = (function() {
	const url = oldBaseUrl + '/config';
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

module.exports = router => router
	.get('/timing/:code', timingHandler)
	.get('/timetable', timetableHandler)
	.get('/subway/routes', subwayRoutesHandler)
	.get('/subway', subwayTimetableHandler)
	.get('/datetime', datetimeHandler);
