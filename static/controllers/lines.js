const linesInit = (container, filterInput) => {
	const get = async () => {
		const [template, lines] = await Promise.all([
			templates.get('lines'),
			db.getLines()
		]);
		container.innerHTML = template(lines);
	};

	const filter = () => {
		const prefix = filterInput.value;
		const nodes = document.querySelectorAll('.lines a');
		nodes.forEach(element => {
			const lineName = element.getAttribute('data-line-name') || '';

			if(lineName.indexOf(prefix) === -1) {
				element.classList.add('hidden');
			} else {
				element.classList.remove('hidden');
			}
		});
	}

	get();
	filterInput.addEventListener('keyup', filter);
};
