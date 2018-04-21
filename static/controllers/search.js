const searchInit = (input, container) => {
	const loadStops = async (str) => {
		const [template, stops] = await Promise.all([
			templates.get('search'),
			(str.length > 0 ? db.searchStops(str) : [])
		]);
		const data = {
			results: stops,
			input: str,
		};
		container.innerHTML = template(data);
	};

	input.addEventListener('keyup', (e) => {
		loadStops(input.value);
	});
};
