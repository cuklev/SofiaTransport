var homeController = (function() {
	return function() {
		templates.get('home').then(function(result) {
			$('#container').html(result());
		});
	};
}());
