const routesController = (function() {
	function get(linetype, linename) {
		const line = {
			type: linetype,
			name: linename
		};

		Promise.all([
			templates.get('routes'),
			db.getRoutes(line)
		]).then(function([template, routes]) {
			const params = {
				routes,
				linetype,
				linename,
				transport: ['Трамвай', 'Автобус', 'Тролейбус'][linetype]
			};
			$('#routes-container').html(template(params));
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
