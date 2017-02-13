const favouritesController = (function() {
	const STORAGE_KEY = 'fav_stops';

	let favourites = {};

	function load() {
		const str = localStorage.getItem(STORAGE_KEY) || '';

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
		localStorage.setItem(STORAGE_KEY, str);
	}

	function rename(target, id) {
		favourites[id] = target.value.trim() || `(${id})`;
		save();
		get();
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
					$li.html(`<input>`);
					const $input = $li.find('input');
					$input.val($name.html().trim());
					$input.focus();

					$input.on('blur', function(e) {
						rename(e.target, stop_id)
					});
					$input.on('keyup', function(e) {
						if(e.which === 13) {
							rename(e.target, stop_id)
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
		if(favourites.hasOwnProperty(stopcode)) {
			return;
		}
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
