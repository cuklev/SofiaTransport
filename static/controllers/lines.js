var linesController = (function() {
	function get(prefix) {
		var template, lines;

		function update() {
			if(template === undefined
			 || lines === undefined) {
				return;
			}

			$('#linesContainer').html(template(lines));
		}

		templates.get('lines').then(function(result) {
			template = result;
			update();
		});

		db.getLines().then(function(result) {
			lines = {};
			for(var i in result) {
				lines[i] = result[i].filter(function(x) {
					return (x.indexOf(prefix) === 0);
				});
			}

			update();
		});
	}

	return {
		get: get
	};
}());
