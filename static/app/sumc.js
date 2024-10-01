const sumc = (() => {
	const getTiming = async (code) => {
		return await request.getJSON(`api/timing/${code}`);
	};
	const getRoute = async (type, name) => {
		return await request.getJSON(`api/route/${type}/${name}`);
	};

	return {
		getTiming,
		getRoute
	};
})();
