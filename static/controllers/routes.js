const routesController = (function() {
	const transportType = {
		tram: 'Трамвай',
		bus: 'Автобус',
		trolley: 'Тролейбус',
	};

	function get(type, name) {
		Promise.all([
			templates.get('routes'),
			db.getRoutes(type, name)
		]).then(function([template, routes]) {
			routes.forEach(x => x.routename = x[0].name + ' - ' + x[x.length - 1].name);
			const data = {
				routes,
				type,
				transport: transportType[type],
				name,
			};
			$('#routes-container').html(template(data));
		});
	}

	function getSubway() {
		Promise.all([
			templates.get('subwayRoutes'),
			sumc.getSubwayRoutes()
		]).then(function([template, stations]) {
			const data = {
				stations: stations
			};
			$('#routes-container').html(template(data));
		});
	}

	return {
		get: get,
		getSubway: getSubway
	};
}());
