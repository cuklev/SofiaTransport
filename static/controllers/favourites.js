const favouritesInit = (container, STORAGE_KEY) => {
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

	const storageString = localStorage.getItem(STORAGE_KEY) || '';

	try {
		favourites = JSON.parse(storageString);
	}
	catch(e) {
		save();
	}

	render();

	container.addEventListener('click', e => {
		const target = e.target;

		if(target.classList.contains('remove-favourite')) {
			remove(target.parentNode.getAttribute('data-stop-code'));
			return;
		}

		if(target.classList.contains('edit-favourite')) {
			const li = target.parentNode;
			const stopcode = li.getAttribute('data-stop-code');
			const input = document.createElement('input');
			const ahref = li.querySelector('a[href]');
			input.value = ahref.innerHTML.trim();

			input.addEventListener('blur', e => rename(e.target, stopcode));
			input.addEventListener('keyup', e => {
				if(e.which === 13) rename(e.target, stopcode);
			});

			li.innerHTML = '';
			li.appendChild(input);
			input.focus();
		}
	});

	return {
		add,
	};
};
