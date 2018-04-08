const timingController = (function() {
	function listTimings(grouped) {
		const listed = [];
		grouped.forEach(function(line) {
			line.arrivals.forEach(function(arrival) {
				listed.push({
					name: line.name,
					type: line.vehicle_type,
					time: arrival.time,
				});
			});
		});
		listed.sort(function(a, b) {
			return a.time > b.time;
		});
		return listed;
	}

	function setTimingFormat() {
		if($('#timing-format')[0].checked) {
			$('.times-grouped').removeClass('hidden');
			$('.times-listed').addClass('hidden');
		} else {
			$('.times-grouped').addClass('hidden');
			$('.times-listed').removeClass('hidden');
		}
	}

	function get(code, type, name) {
		Promise.all([
			templates.get('timing'),
			sumc.getTiming(code),
		]).then(function([template, timings]) {
			let grouped = timings.lines;
			const listed = listTimings(grouped);

			const index = grouped.findIndex(x => x.vehicle_type === type && x.name === name);
			if(index >= 0 && grouped.length > 0) {
				const viewed = grouped.splice(index, 1);
				viewed[0].separate = true;
				grouped = viewed.concat(grouped);
			}

			const data = {
				name: timings.name,
				code: timings.code,
				grouped,
				listed,
			};

			$('#timing-container').html(template(data));
			setTimingFormat();
		});
	}

	function load(code) {
		$('#timing-container').prepend(`<h3>Loading timings for stop ${code}</h3>`);
		get(code);
	}

	$('#timing-format').on('change', setTimingFormat);

	return {
		load,
	};
}());
