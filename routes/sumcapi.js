const timingUrl = 'https://api-arrivals.sofiatraffic.bg/api/v1/arrivals';
const timingHandler = async (req, res) => {
	const code = req.params.code;
	const result = await fetch(`${timingUrl}/${code}/`);
	if (!result.ok) {
		console.error(`Error: ${res.statusText}`);
		throw res.statusText;
	}

	const text = await result.text();
	res.send(text);
};

module.exports = router => router
	.get('/timing/:code', timingHandler);
