var linesController = (function() {
	function get() {
		var template, lines;

		function update() {
			if(template === undefined
			 || lines === undefined) {
				return;
			}

			$('#linesContainer').html(template(lines));

			$('#linesContainer .tram').on('click', function(e) {
				var linename = e.target.innerHTML;
				routesController.get(0, linename);
			})
			$('#linesContainer .bus').on('click', function(e) {
				var linename = e.target.innerHTML;
				routesController.get(1, linename);
			})
			$('#linesContainer .trolley').on('click', function(e) {
				var linename = e.target.innerHTML;
				routesController.get(2, linename);
			})
		}

		templates.get('lines').then(function(result) {
			template = result;
			update();
		});

		db.getLines().then(function(result) {
			var prefix = $('#enterLinename').val();

			lines = {};
			for(var i in result) {
				lines[i] = result[i].filter(function(x) {
					return (x.indexOf(prefix) === 0); // rewrite me better
				});
			}

			update();
		});
	}

	return {
		get: get
	};
}());
