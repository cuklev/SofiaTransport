var timingController = (function() {
	var template;

	function update(stopcode) {
		templates.get('timing').then(function(result) {
			template = result;
			return sumc.getTiming(stopcode);
		}).then(function(timings) {
			timings = timings.map(function(x) {
				return {
					line: +x.lineName,
					type: ['tram', 'bus', 'trolley'][x.type],
					timing: x.timing.split(',')
				};
			});
			timings.sort(function(a, b) {
				return a.line - b.line;
			});

			$('#container').html(template(timings));
		});
	}

	function get() {
		update(this.params.stopcode);
	};

	return {
		get: get,
		update: update
	};
}());
