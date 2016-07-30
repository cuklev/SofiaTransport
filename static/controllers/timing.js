var timingController = (function() {
	function get(stopcode) {
		var template, timings, stopname;

		function expandTimes() {
			var expanded = [];
			timings.forEach(function(line) {
				line.timing.forEach(function(time) {
					if(time === '') {
						return;
					}
					expanded.push({
						line: line.line,
						type: line.type,
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

		function update() {
			if(template === undefined
			 || timings === undefined
			 || stopname === undefined) {
				return;
			}

			var params = {
				timings: timings,
				expanded: expandTimes(),
				stopcode: stopcode,
				stopname: stopname
			};
			$('#timingContainer').html(template(params));

			setTimingFormat();

			$('#timingContainer .tram').on('click', function(e) {
				var linename = e.target.innerHTML;
				routesController.get(0, linename);
			});
			$('#timingContainer .bus').on('click', function(e) {
				var linename = e.target.innerHTML;
				routesController.get(1, linename);
			});
			$('#timingContainer .trolley').on('click', function(e) {
				var linename = e.target.innerHTML;
				routesController.get(2, linename);
			});
		}

		templates.get('timing').then(function(result) {
			template = result;
			update();
		});

		sumc.getTiming(stopcode).then(function(result) {
			if(!Array.isArray(result)) {
				timings = false;
				update();
				return;
			}

			timings = result.map(function(x) {
				return {
					line: +x.lineName,
					type: ['tram', 'bus', 'trolley'][x.type],
					timing: x.timing.split(',') // must sort these parts
				};
			}).sort(function(a, b) {
				return a.line - b.line;
			});

			update();
		});

		db.getStopname(stopcode).then(function(result) {
			stopname = result;
			update();
		});
	}

	return {
		get: get
	};
}());
