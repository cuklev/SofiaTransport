const routesInit = (container) => {
	const transportType = {
		tram: 'Трамвай',
		bus: 'Автобус',
		nightbus: 'Нощен автобус',
		trolley: 'Тролейбус',
		subway: 'Метро',
	};

	const get = async (type, name) => {
		const [template, routes, stops] = await Promise.all([
			templates.get('routes'),
			sumc.getRoute(type, name),
			db.getStops()
		]);

		const data = {
			type,
			typeName: transportType[type],
			name,
			routes: routes.map(route => ({
				name: route.name,
				stops: route.stops.map(code => ({
					code,
					name: stops[code]
				}))
			}))
		};
		container.innerHTML = template(data);
	};

	return {
		get,
	};
};
