var timingController = (function() {
	function get(stopcode) {
		var template, timings;

		function update() {
			if(template === undefined) {
				return;
			}
			if(timings === undefined) {
				return;
			}

			$('#timingContainer').html(template(timings));
		}

		templates.get('timing').then(function(result) {
			template = result;
			update();
		});

		sumc.getTiming(stopcode).then(function(result) {
			timings = result.map(function(x) {
				return {
					line: +x.lineName,
					type: ['tram', 'bus', 'trolley'][x.type],
					timing: x.timing.split(',') // must sort these parts
				};
			}).sort(function(a, b) {
				return a.line - b.line;
			});

			update();
		});
	}

	return {
		get: get
	};
}());
