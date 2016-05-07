$(window).on('hashchange', function() {
	var stopcode = location.hash.replace(/^#/, '');
	timingController.get(stopcode);
});

$(function() {
	var input = $('#enterStopcode');
	input.on('keyup', function(e) {
		if(e.which !== 13) {
			return;
		}

		location.hash = '#' + input.val();
		// rewrite this better
	});
});
