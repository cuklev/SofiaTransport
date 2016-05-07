var routesController = (function() {
	function get(linetype, linename) {
		var template, routes;

		function update() {
			if(template === undefined
			 || routes === undefined) {
				return;
			}

			$('#routesContainer').html(template(routes));
		}

		templates.get('routes').then(function(result) {
			template = result;
			update();
		});

		var line = {
			type: linetype,
			name: linename
		};
		db.getRoutes(line).then(function(result) {
			routes = result;
			update();
		});
	}

	return {
		get: get
	};
}());
