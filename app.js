(function() {
	var sammy = Sammy('#content', function() {
		this.get('#/', homeController);

		this.get('#/timing/:stopcode', timingController);
	});

	sammy.run('#/');
}());
