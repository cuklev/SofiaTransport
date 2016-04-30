var timingController = (function() {
	return function() {
		var stopcode = this.params.stopcode;

		templates.get('timing').then(function(result) {
			sumc.getTiming(stopcode).then(function(timings) {
				$('#container').html(result(timings));
			});
		});
	};
}());

