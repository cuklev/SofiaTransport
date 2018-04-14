const favouritesController = (() => {
	const STORAGE_KEY = 'fav_stops';
	const container = document.querySelector('#favourites-container');

	let favourites = {};

	const render = async () => {
		const template = await templates.get('favourites');
		container.innerHTML = template(favourites);
	};

	const add = (stopcode, stopname) => {
		if(favourites.hasOwnProperty(stopcode)) {
			return;
		}
		favourites[stopcode] = `${stopname} (${stopcode})`;
		save();
		render();
	};

	const rename = (target, id) => {
		favourites[id] = target.value.trim() || `(${id})`;
		save();
		render();
	};

	const remove = (stopcode) => {
		delete favourites[stopcode];
		save();
		render();
	};

	const save = () => {
		const str = JSON.stringify(favourites);
		localStorage.setItem(STORAGE_KEY, str);
	};

	const load = () => {
		const str = localStorage.getItem(STORAGE_KEY) || '';

		try {
			favourites = JSON.parse(str);
		}
		catch(e) {
			save();
		}

		render();

		container.addEventListener('click', e => {
			const target = e.target;

			if(target.classList.contains('remove-favourite')) {
				remove(target.parentNode.getAttribute('data-stop-id'));
				return;
			}

			if(target.classList.contains('edit-favourite')) {
				const li = target.parentNode;
				const stopId = li.getAttribute('data-stop-id');
				const input = document.createElement('input');
				const ahref = li.querySelector('a[href]');
				input.value = ahref.innerHTML.trim();

				input.addEventListener('blur', e => rename(e.target, stopId));
				input.addEventListener('keyup', e => {
					if(e.which === 13) rename(e.target, stopId);
				});

				li.innerHTML = '';
				li.appendChild(input);
				input.focus();
			}
		});
	};

	return {
		load,
		add,
	};
})();
