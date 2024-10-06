const timingInit = (container, formatCheckbox, autoPoll) => {
	const setTimingFormat = () => {
		if(formatCheckbox.checked) {
			document.querySelectorAll('.times-grouped')
				.forEach(x => x.classList.remove('hidden'));
			document.querySelectorAll('.times-listed')
				.forEach(x => x.classList.add('hidden'));
		} else {
			document.querySelectorAll('.times-grouped')
				.forEach(x => x.classList.add('hidden'));
			document.querySelectorAll('.times-listed')
				.forEach(x => x.classList.remove('hidden'));
		}
	};

	const transportTypes = ['0', 'bus', 'tram', 'subway', 'trolley', 'nightbus'];

	const compareTransports = (a, b) => {
		if (a.selected) return -1;
		if (b.selected) return 1;
		return a.name.localeCompare(b.name);
	};

	const get = async (code, type, name) => {
		const [template, timings, stops] = await Promise.all([
			templates.get('timing'),
			sumc.getTiming(code),
			db.getStops()
		]);

		const listed = [];
		const grouped = Object.values(timings)
			.map(timing => {
				timing.details.forEach(det => {
					const item = {
						type: transportTypes[timing.type],
						name: timing.name,
						selected: transportTypes[timing.type] === type && timing.name === name,
						route: timing.route_name,
						arrivals: timing.details
					};
					Object.assign(item, det);
					listed.push(item);
				});
				return {
					type: transportTypes[timing.type],
					name: timing.name,
					selected: transportTypes[timing.type] === type && timing.name === name,
					route: timing.route_name,
					arrivals: timing.details
				};
			}).sort(compareTransports);
		listed.sort((a, b) => a.t - b.t);

		const data = {
			code,
			name: stops[code],
			grouped,
			listed
		};
		container.innerHTML = template(data);
		setTimingFormat();
	};

	const load = (code, type, id) => {
		const loading = document.createElement('H3');
		loading.innerHTML = `Loading timings for stop ${code}`;
		container.insertBefore(loading, container.firstChild);
		get(code, type, id);
	};

	formatCheckbox.addEventListener('change', setTimingFormat);

	let pollTimeout = false;
	const pollNow = () => {
		if(autoPoll.checked && document.hasFocus()) {
			const code = router.getStopcode();
			if(!code) return;
			const [type, name] = router.getLine();
			get(code, type, name);
			pollTimeout = setTimeout(pollNow, 15000);
		} else {
			pollTimeout = false;
		}
	};
	const schedulePoll = () => {
		if(!pollTimeout) {
			pollNow();
		}
	};

	schedulePoll();
	autoPoll.addEventListener('change', schedulePoll);
	document.addEventListener('focus', schedulePoll);

	return {
		load,
	};
};
