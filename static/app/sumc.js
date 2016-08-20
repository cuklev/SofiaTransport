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

	var getSubwayRoutes = (function() {
		var url = baseUrl + '/subway/routes';

		return function() {
			var promise = new Promise(function(resolve, reject) {
				$.getJSON(url, function(routes) {
					console.log(routes);
					resolve(routes);
				});
			});

			return promise;
		}
	}());

	var getSubwayTimings = (function() {
		var url = baseUrl + '/subway';

		return function(id) {
			var data = {
				id: id
			};

			var promise = new Promise(function(resolve, reject) {
				$.getJSON(url, data, function(timings) {
					resolve(timings);
				});
			});
		}
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
		getTimetable: getTimetable,
		getSubwayRoutes: getSubwayRoutes,
		getSubwayTimings: getSubwayTimings,
		getDatetime: getDatetime
	};
}());
