const sumc = (function() {
	const baseUrl = 'api';

	const getTiming = (code) => request.getJSON(`${baseUrl}/timing/${code}`);

	return {
		getTiming,
	};
}());
