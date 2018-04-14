const timingController = (function() {
	const container = document.querySelector('#timing-container');
	const formatCheckbox = document.querySelector('#timing-format');

	function listTimings(grouped) {
		const listed = [];
		grouped.forEach(function(line) {
			line.arrivals.forEach(function(arrival) {
				const item = {
					name: line.name,
					type: line.vehicle_type,
				};
				Object.assign(item, arrival);
				listed.push(item);
			});
		});
		listed.sort(function(a, b) {
			return a.time.replace(/:/g, '') - b.time.replace(/:/g, '');
		});
		return listed;
	}

	function setTimingFormat() {
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
	}

	function get(code, type, name) {
		Promise.all([
			templates.get('timing'),
			sumc.getTiming(code),
		]).then(function([template, timings]) {
			let grouped = timings.lines;
			const listed = listTimings(grouped);

			grouped.sort(function(a, b) {
				return a.name - b.name;
			});

			const index = grouped.findIndex(x => x.vehicle_type === type && x.name === name);
			if(index >= 0 && grouped.length > 0) {
				const viewed = grouped.splice(index, 1);
				viewed[0].separate = true;
				grouped = viewed.concat(grouped);
			}

			const data = {
				name: timings.name,
				code: timings.code,
				timestamp: timings.timestamp_calculated,
				grouped,
				listed,
			};

			container.innerHTML = template(data);
			setTimingFormat();
		});
	}

	function load(code) {
		const loading = document.createElement('H3');
		loading.innerHTML = `Loading timings for stop ${code}`;
		container.insertBefore(loading, container.firstChild);
		get(code);
	}

	formatCheckbox.addEventListener('change', setTimingFormat);

	return {
		get,
		load,
	};
}());
