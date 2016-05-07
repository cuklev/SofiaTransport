var db = (function() {
	var getStopname = (function() {
		var url = '/api/stopname';

		return function(stopcode) {
			var data = {
				stopcode: stopcode
			};

			var promise = new Promise(function(resolve, reject) {
				$.post(url, data, function(stopname) {
					resolve(stopname);
				});
			});

			return promise;
		}
	}());

	var getLines = (function() {
		var cache;
		var url = '/api/lines';

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
