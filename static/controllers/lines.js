const linesController = (function() {
	function get() {
		Promise.all([
			templates.get('lines'),
			db.getLines()
		])
		.then(function([template, lines]) {
			const data = {
				lines,
				stopcode: router.getStopcode()
			};
			$('#lines-container').html(template(data));
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
