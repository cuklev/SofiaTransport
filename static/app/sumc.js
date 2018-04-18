const sumc = (() => {
	const baseUrl = 'api';

	const getTiming = (code) => request.getJSON(`${baseUrl}/timing/${code}`);

	return {
		getTiming,
	};
})();
