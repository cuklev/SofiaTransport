const linesController = (() => {
	const container = document.querySelector('#lines-container');
	const filterInput = document.querySelector('#enter-linename');

	const get = async () => {
		const [template, lines] = await Promise.all([
			templates.get('lines'),
			db.getLines()
		]);
		container.innerHTML = template(lines);
	};

	function filter() {
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

	return {
		get,
		filter,
	};
})();
