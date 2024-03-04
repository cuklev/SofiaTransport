const sumc = (() => {
	const baseUrl = 'api';

	const getTiming = async (code) => {
		const timings = await request.getJSON(`${baseUrl}/timing/${code}`);
		timings.lines.forEach(x => x.id = x.name);
		return timings;
	};

	return {
		getTiming,
	};
})();
