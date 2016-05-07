function loadTiming() {
	var stopcode = +location.hash.replace(/^#/, '');
	if(!Number(stopcode)) {
		return;
	}

	$('#timingContainer').prepend('<h3>Loading timings for stop ' + stopcode + '<h3>')
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
