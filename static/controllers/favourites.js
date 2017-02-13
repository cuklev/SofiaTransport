const favouritesController = (function() {
	let favourites = {};

	function load() {
		const str = localStorage.getItem('fav_stops');

		try {
			favourites = JSON.parse(str);
		}
		catch(e) {
			save();
		}

		get();
	}

	function save() {
		const str = JSON.stringify(favourites);
		localStorage.setItem('fav_stops', str);
	}

	function get() {
		templates.get('favourites')
			.then(function(template) {
				$('#favourites-container').html(template(favourites));

				// TODO: use a single event
				$('.edit-favourite').on('click', 'img', function(e) {
					const $li = $(e.target).parent().parent();
					const stop_id = $li.data('stopId');
					const $name = $li.find('a[href]');
					$li.html(`<input value="${$name.html().trim()}">`);
					const $input = $li.find('input');
					$input.focus();

					function rename() {
						favourites[stop_id] = $input.val().trim() || `(${stop_id})`;
						save();
						get();
					}
					$input.on('blur', rename);
					$input.on('keyup', function(e) {
						if(e.which === 13) {
							rename();
						}
					});
				});
				$('.remove-favourite').on('click', 'img', function(e) {
					const stop_id = $(e.target).parent().parent().data('stopId');
					remove(stop_id);
				});
			});
	}

	function add(stopcode, stopname) {
		favourites[stopcode] = `${stopname} (${stopcode})`;
		save();
		get();
	}

	function remove(stopcode) {
		delete favourites[stopcode];
		save();
		get();
	}

	return {
		load: load,
		add: add
	};
}());
