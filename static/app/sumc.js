var sumc = (function() {
	var baseUrl = '/sumcapi';

	var getTiming = (function() {
		var url = baseUrl + '/timing';

		return function(stopCode) {
			var data = {
				stopCode: stopCode
			};

			var promise = new Promise(function(resolve, reject) {
				$.get(url, data, function(timings) {
					resolve(timings);
				});
			});

			return promise;
		};
	}());

	var getTimetable = (function() {
		var url = baseUrl + '/timetable';

		return function(stopCode) {
			var data = {
				stopCode: stopCode
			};

			var promise = new Promise(function(resolve, reject) {
				$.get(url, data, function(timings) {
					resolve(timings);
				});
			});

			return promise;
		};
	}());

	var getDatetime = (function() {
		var url = baseUrl + '/datetime';

		return function() {
			var promise = new Promise(function(resolve, reject) {
				$.get(url, function(datetime) {
					resolve(datetime);
				});
			});
		}
	}());

	return {
		getTiming: getTiming,
		getDatetime: getDatetime
	};
}());
