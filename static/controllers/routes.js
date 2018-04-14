const routesInit = (container) => {
	const transportType = {
		tram: 'Трамвай',
		bus: 'Автобус',
		trolley: 'Тролейбус',
	};

	const get = async (type, name) => {
		const [template, routes] = await Promise.all([
			templates.get('routes'),
			db.getRoutes(type, name)
		]);

		routes.forEach(x => x.routename = x[0].name + ' - ' + x[x.length - 1].name);
		const data = {
			routes,
			type,
			transport: transportType[type],
			name,
		};
		container.innerHTML = template(data);
	};

	// not really sure what this does ATM
	const getSubway = async () => {
		const [template, stations] = await Promise.all([
			templates.get('subwayRoutes'),
			sumc.getSubwayRoutes()
		]);
		container.innerHTML = template({stations});
	};

	return {
		get,
		getSubway,
	};
};
