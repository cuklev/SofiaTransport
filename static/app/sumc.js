const sumc = (() => {
	const baseUrl = 'api';

	const getTiming = async (code) => {
		return await request.getJSON(`${baseUrl}/timing/${code}`);
	};

	return {
		getTiming,
	};
})();
