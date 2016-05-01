(function() {
	var sammy = Sammy('#container', function() {
		this.get('#/', homeController);

		this.get('#/timing/:stopcode', timingController.get);
	});

	sammy.run('#/');
}());

$(function() {
	var input = $('#enterStopcode');
	input.on('keyup', function(e) {
		var stopcode = input.val();
		if(!stopcode.match(/[0-9]{4}/)) {
			return;
		}

		document.location = '#/timing/' + stopcode;
		timingController.update(stopcode);
	});
});
