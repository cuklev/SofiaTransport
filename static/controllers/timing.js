var timingController = (function() {
	function get(stopcode) {
		var template, timings, stopname;

		function update() {
			if(template === undefined
			 || timings === undefined
			 || stopname === undefined) {
				return;
			}

			var params = {
				timings: timings,
				stopname: stopname
			};

			$('#timingContainer').html(template(params));
		}

		templates.get('timing').then(function(result) {
			template = result;
			update();
		});

		sumc.getTiming(stopcode).then(function(result) {
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
