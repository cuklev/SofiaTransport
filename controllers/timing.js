var timingController = (function() {
	var template;

	function get() {
		var stopcode = this.params.stopcode;

		templates.get('timing').then(function(result) {
			template = result;
			return sumc.getTiming(stopcode);
		}).then(function(timings) {
			timings = timings.map(function(x) {
				return {
					line: x.lineName,
					type: ['tram', 'bus', 'trolley'][x.type],
					timing: x.timing.split(',')
				};
			});
			$('#container').html(template(timings));
		});
	};

	return get;
}());
