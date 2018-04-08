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

	function get(stopcode) {
		Promise.all([
			templates.get('timing'),
			sumc.getTiming(stopcode),
		]).then(function([template, timings]) {
			let grouped = timings.lines;

			const [linetype, linename] = router.getLine();
			const index = grouped.findIndex(x => x.vehicle_type === linetype && x.name === linename);
			if(index >= 0 && grouped.length > 0) {
				const viewed = grouped.splice(index, 1);
				viewed[0].separate = true;
				grouped = viewed.concat(grouped);
			}

			const listed = listTimings(grouped);

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

	function load(stopcode) {
		$('#timing-container').prepend(`<h3>Loading timings for stop ${stopcode}</h3>`);
		get(stopcode);
	}

	$('#timing-format').on('change', setTimingFormat);

	return {
		load: load
	};
}());
