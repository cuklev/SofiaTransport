const favouritesController = (function() {
	const favourites = {};

	function load() {
		const str = localStorage.getItem('fav_stops');

		favourites = {};
		if(str === null) {
			return;
		}

		str.split(';').forEach(function(x) {
			x = x.split('"');
			favourites[x[0]] = x[1];
		});
	}

	function save() {
		let str = '';
		for(const stopcode in favourites) {
			if(str !== '') {
				str += ';';
			}
			str += stopcode + '"' + favourites[stopcode];
		}

		localStorage.setItem('fav_stops', str);
	}

	function get() {
		templates.get('favourites').then(function(template) {
			$('#favourites-container').html(template(favourites));

			// TODO: use a single event
			$('.remove-favourite').on('click', function(e) {
				const stop_id = $(e.target).data('stopId');
				remove(stop_id);
			});
		});
	}

	function add(stopcode, stopname) {
		favourites[stopcode] = stopname;
		save();
		get();
	}

	function remove(stopcode) {
		delete favourites[stopcode];
		save();
		get();
	}

	return {
		get: get,
		save: save,
		load: load,
		add: add,
		remove: remove
	};
}());
