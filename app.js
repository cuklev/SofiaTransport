(function() {
	var sammy = Sammy('#content', function() {
		this.get('#/', function() {
			console.log('spam');
		});
	});

	sammy.run('#/');
}());
