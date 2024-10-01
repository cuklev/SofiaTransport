const {getSessionHeaders} = require('../cache');

const timingUrl = 'https://www.sofiatraffic.bg/bg/trip/getVirtualTable';
const timingHandler = async (req, res) => {
	const code = req.params.code;
	const result = await fetch(timingUrl, {
		method: 'POST',
		headers: getSessionHeaders(),
		body: JSON.stringify({
			stop: code,
			type: 1
		})
	});
	if (!result.ok) {
		console.error(`Error: ${result.statusText}`);
		throw res.statusText;
	}

	const text = await result.text();
	res.send(text);
};

module.exports = router => router
	.get('/timing/:code', timingHandler);
