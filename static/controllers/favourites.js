var favouritesController = (function() {
	var favourites = {};

	function load() {
		var str = localStorage.getItem('fav_stops');

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
		var str = '';
		for(var stopcode in favourites) {
			if(str !== '') {
				str += ';';
			}
			str += stopcode + '"' + favourites[stopcode];
		}

		localStorage.setItem('fav_stops', str);
	}

	function get() {
		templates.get('favourites').then(function(template) {
			$('#favouritesContainer').html(template(favourites));

			var stops = document.getElementsByClassName('favourite_stop');
			[].forEach.call(stops, function(stop) {
				var stopId = stop.id.replace(/.*_/, '');
				stop.onclick = function() {
					remove(stopId);
				};
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
