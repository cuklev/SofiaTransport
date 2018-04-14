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


(function() {
	const autoPoll = document.querySelector('#auto-poll');
	let timeout = false;

	function pollNow() {
		if(autoPoll.checked && document.hasFocus()) {
			const code = router.getStopcode();
			const [type, name] = router.getLine();
			timingController.get(code, type, name);
			timeout = setTimeout(pollNow, 15000);
		} else {
			timeout = false;
		}
	}

	function schedulePoll() {
		if(!timeout) {
			pollNow();
		}
	}

	schedulePoll();

	autoPoll.addEventListener('change', schedulePoll);
	document.addEventListener('focus', schedulePoll);
})();
