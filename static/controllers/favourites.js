const favouritesController = (() => {
	const STORAGE_KEY = 'fav_stops';

	let favourites = {};

	const load = () => {
		const str = localStorage.getItem(STORAGE_KEY) || '';

		try {
			favourites = JSON.parse(str);
		}
		catch(e) {
			save();
		}

		get();
	};

	const save = () => {
		const str = JSON.stringify(favourites);
		localStorage.setItem(STORAGE_KEY, str);
	};

	const rename = (target, id) => {
		favourites[id] = target.value.trim() || `(${id})`;
		save();
		get();
	};

	const get = async () => {
		const template = await templates.get('favourites');
		$('#favourites-container').html(template(favourites));

		// TODO: use a single event
		$('.edit-favourite').on('click', 'img', (e) => {
			const $li = $(e.target).parent().parent();
			const stop_id = $li.data('stopId');
			const $name = $li.find('a[href]');
			$li.html(`<input>`);
			const $input = $li.find('input');
			$input.val($name.html().trim());
			$input.focus();

			$input.on('blur', (e) => rename(e.target, stop_id));
			$input.on('keyup', (e) => {
				if(e.which === 13) {
					rename(e.target, stop_id)
				}
			});
		});
		$('.remove-favourite').on('click', 'img', (e) => {
			const stop_id = $(e.target).parent().parent().data('stopId');
			remove(stop_id);
		});
	};

	const add = (stopcode, stopname) => {
		if(favourites.hasOwnProperty(stopcode)) {
			return;
		}
		favourites[stopcode] = `${stopname} (${stopcode})`;
		save();
		get();
	};

	const remove = (stopcode) => {
		delete favourites[stopcode];
		save();
		get();
	};

	return {
		load,
		add,
	};
})();
