function loadTiming() {
	var stopcode = location.hash.replace(/^#/, '');
	timingController.get(stopcode);
}

$(loadTiming);
$(window).on('hashchange', loadTiming);

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
