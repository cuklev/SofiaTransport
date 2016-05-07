var timingController = (function() {
	var template;

	function get(stopcode) {
		templates.get('timing').then(function(result) {
			template = result;
			return sumc.getTiming(stopcode);
		}).then(function(timings) {
			timings = timings.map(function(x) {
				return {
					line: +x.lineName,
					type: ['tram', 'bus', 'trolley'][x.type],
					timing: x.timing.split(',') // must sort these parts
				};
			}).sort(function(a, b) {
				return a.line - b.line;
			});

			$('#timingContainer').html(template(timings));
		});
	}

	return {
		get: get
	};
}());
