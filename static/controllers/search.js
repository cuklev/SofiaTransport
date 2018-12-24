const searchInit = (input, container) => {
	const loadStops = async (str) => {
		const [template, stops] = await Promise.all([
			templates.get('search'),
			db.searchStops(str)
		]);
		const data = {
			results: stops,
			input: str,
		};
		container.innerHTML = template(data);
	};

	input.addEventListener('keyup', (e) => {
		if(input.value.length > 0) {
			loadStops(input.value);
		} else {
			const [type, name] = router.getLine();
			if(type && name) {
				routesController.get(type, name);
			} else {
				container.innerHTML = '';
			}
		}
	});
};
