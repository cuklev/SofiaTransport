const linesController = (function() {
	function get() {
		Promise.all([
			templates.get('lines'),
			db.getLines()
		])
		.then(function([template, lines]) {
			$('#lines-container').html(template(lines));

			let lastSelected;

			$('.lines').on('click', 'a', function (e) {
				const $target = $(e.target),
					data = $target.data(),
					lineType = data.lineType,
					lineName = data.lineName;

				if(lineType === 3) {
					routesController.getSubway();
				}
				else {
					routesController.get(lineType, lineName);
				}

				if(lastSelected) {
					lastSelected.removeClass('selected');
				}

				$target.addClass('selected');
				lastSelected = $target;
			});
		});
	}

	function filter() {
		const prefix = $('#enter-linename').val();

		$('.lines a').each(function (index, element) {
			const $element = $(element),
				lineName = $element.attr('data-line-name') || '';

			if(lineName.indexOf(prefix) === -1) {
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
