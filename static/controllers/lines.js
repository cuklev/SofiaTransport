var linesController = (function() {
	function get() {

		Promise.all([
			db.getLines(),
			templates.get('lines')
		])
		.then(function (values) {
			var lines = values[0],
				template = values[1];

			$('#linesContainer').html(template(lines));

			var lastSelected;

			$('.lines').on('click', 'a', function (ev) {
				var $target = $(ev.target),
					transportType = $target
										.parents('li')
										.data()['lineType'];

				routesController.get(transportType, $target.text());

				if(lastSelected) {
					lastSelected.removeClass('selected');
				}

				$target.addClass('selected');
				lastSelected = $target;
			});
		});
	}

	function filter() {
		var prefix = $('#enterLinename').val();

		$('.lines a').each(function (index, element) {
			var $element = $(element),
			indexOf = $element.text().toLowerCase().indexOf(prefix);

			if(indexOf){
				$element.addClass('hidden');
			}
			else {
				$element.removeClass('hidden');
			}
		});
	}

	return {
		get: get,
		filter: filter
	};
}());
