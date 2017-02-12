$(timingController.load);
$(window).on('hashchange', timingController.load);

$(function() {
	var input = $('#enter-stopcode');
	input.on('keyup', function(e) {
		if(e.which !== 13) {
			return;
		}

		location.hash = '#' + input.val();
		// rewrite this better
	});
});

linesController.get();

$('#enter-linename').on('keyup', function(e) {
	linesController.filter();
});

favouritesController.load();
favouritesController.get();
