const timingController = (function() {
	function get(stopcode) {
		function expandTiming(timings) {
			const expanded = [];
			timings.forEach(function(line) {
				line.timing.forEach(function(time) {
					if(time === '') {
						return;
					}
					expanded.push({
						line: line.line,
						type: line.type,
						typename: line.typename,
						time: time
					});
				});
			});
			expanded.sort(function(a, b) {
				return a.time > b.time;
			});
			return expanded;
		}

		function setTimingFormat() {
			if($('#timing-format')[0].checked) {
				$('.times-by-lines').addClass('hidden');
				$('.times-expanded').removeClass('hidden');
			}
			else {
				$('.times-by-lines').removeClass('hidden');
				$('.times-expanded').addClass('hidden');
			}
		}

		$('#timing-format').on('change', setTimingFormat);

		Promise.all([
			templates.get('timing'),
			sumc.getTiming(stopcode),
			db.getStopname(stopcode)
		]).then(function([template, timings, stopname]) {
			// this should be made async
			if(!Array.isArray(timings)) {
				timings = false;
			}
			else {
				timings = timings.map(function(x) {
					return {
						line: +x.lineName,
						type: x.type,
						typename: ['tram', 'bus', 'trolley'][x.type],
						timing: x.timing.split(',').sort()
					};
				}).sort(function(a, b) {
					return a.line - b.line;
				});
			}

			const params = {
				timings: timings,
				expanded: expandTiming(timings),
				stopcode: stopcode,
				stopname: stopname
			};
			$('#timing-container').html(template(params));

			setTimingFormat();

			$('#timing-container').on('click', 'a', function(e) {
				const $target = $(e.target),
					data = $target.data(),
					lineType = data.lineType,
					lineName = data.lineName;

				routesController.get(lineType, lineName);
			});
		});
	}

	function load() {
		const stopcode = +location.hash.replace(/^#/, '');
		if(!Number(stopcode)) {
			return;
		}

		$('#timingContainer').prepend(`<h3>Loading timings for stop ${stopcode}</h3>`)
		get(stopcode);
	}

	return {
		load: load
	};
}());
