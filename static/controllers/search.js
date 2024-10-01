const searchInit = (input, container) => {
	const loadStops = async (searchString) => {
		const [template, stops] = await Promise.all([
			templates.get('search'),
			db.getStops()
		]);

		const words = searchString.match(/\S+/g)
			.map(w => w.toUpperCase());
		const results = Object.entries(stops)
			.map(([code, name]) => ({code,name}))
			.filter(({code, name}) => {
				const nu = name.toUpperCase();
				return code.indexOf(searchString) >= 0
					|| words.every(w => nu.indexOf(w) >= 0);
			});
		const data = {
			results,
			input: searchString
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
