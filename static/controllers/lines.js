var linesController = (function() {
	function get() {
		Promise.all([
			templates.get('lines'),
			db.getLines()
		])
		.then(function (values) {
			var template = values[0],
				lines = values[1];

			$('#linesContainer').html(template(lines));

			var lastSelected;

			$('.lines').on('click', 'a', function (ev) {
				var $target = $(ev.target),
					transportType = $target.data()['lineType'];

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
