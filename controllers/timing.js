var timingController = (function() {
	var template;

	function get() {
		var stopcode = this.params.stopcode;

		templates.get('timing').then(function(result) {
			template = result;
			return sumc.getTiming(stopcode);
		}).then(function(timings) {
			$('#container').html(template(timings));
		});
	};

	return get;
}());
