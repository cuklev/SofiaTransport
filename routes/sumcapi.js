const request = require('request');

const forwardResponse = (options, send) => request(options, (err, res, body) => {
	if(err) {
		console.error(`Error: ${err}`);
		return;
	}

	send(body);
});

const timingUrl = 'https://api-arrivals.sofiatraffic.bg/api/v1/arrivals';
const timingHandler = (req, res) => {
	const code = req.params.code;
	const options = {
		method: 'get',
		url: `${timingUrl}/${code}/`,
	};
	forwardResponse(options, res.send.bind(res));
};

module.exports = router => router
	.get('/timing/:code', timingHandler);
