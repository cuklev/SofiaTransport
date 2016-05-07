var db = (function() {
	var getStopname = (function() {
		var url = 'api/stopname';
		var cache = {};

		return function(stopcode) {
			var data = {
				stopcode: stopcode
			};

			var promise = new Promise(function(resolve, reject) {
				if(cache[stopcode]) {
					resolve(cache[stopcode]);
					return;
				}

				$.post(url, data, function(stopname) {
					cache[stopcode] = stopname;
					resolve(stopname);
				});
			});

			return promise;
		}
	}());

	var getLines = (function() {
		var url = 'api/lines';
		var cache;

		return function() {
			var promise = new Promise(function(resolve, reject) {
				if(cache) {
					resolve(cache);
					return;
				}
				$.get(url, function(lines) {
					cache = lines;
					resolve(lines);
				});
			});

			return promise;
		};
	}());

	return {
		getStopname: getStopname,
		getLines: getLines
	};
}());
