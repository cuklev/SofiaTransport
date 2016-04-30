var timingController = (function() {
	return function() {
		templates.get('timing').then(function(result) {
			$('#container').html(result());
		});
	};
}());

