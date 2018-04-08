router.navigate();
$(window).on('hashchange', router.navigate);

favouritesController.load();

linesController.get();
$('#enter-linename').on('keyup', function(e) {
	linesController.filter();
});

$(function() {
	const input = $('#enter-stopcode');
	input.on('keyup', function(e) {
		if(e.which !== 13) {
			return;
		}

		const val = input.val();
		if(!val.match(/^[0-9]{1,4}$/)) {
			return;
		}
		const code = ('0000' + val).match(/[0-9]{4}$/)[0];
		router.setStopcode(code);
	});
});
