const searchInit = (input, container) => {
	const loadStops = async (str) => {
		const [template, stops] = await Promise.all([
			templates.get('search'),
			db.searchStops(str)
		]);
		container.innerHTML = template(stops);
	};

	input.addEventListener('keyup', (e) => {
		if(input.value.length === 0) {
			return;
		}
		loadStops(input.value);
	});
};
