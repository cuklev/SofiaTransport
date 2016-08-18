var routesController = (function() {
	function get(linetype, linename) {
		var line = {
			type: linetype,
			name: linename
		};

		Promise.all([
			templates.get('routes'),
			db.getRoutes(line)
		]).then(function(values) {
		var template = values[0],
			routes = values[1];

			var params = {
				routes: routes,
				linetype: ['Трамвай', 'Автобус', 'Тролейбус'][linetype],
				linename: linename
			};
			$('#routes-container').html(template(params));
		});
	}

	return {
		get: get
	};
}());
