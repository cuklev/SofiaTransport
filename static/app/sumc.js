const sumc = (function() {
	const baseUrl = 'api';

	const getTiming = (function() {
		const url = `${baseUrl}/timing`;

		return function(code) {
			const data = { stopCode: code };
			const promise = new Promise(function(resolve, reject) {
				$.get(url, data, function(timings) {
					resolve(timings);
				});
			});

			return promise;
		};
	}());

	const getTimetable = (function() {
		const url = `${baseUrl}/timetable`;

		return function(stopCode) {
			const data = {
				stopCode: stopCode
			};

			const promise = new Promise(function(resolve, reject) {
				$.get(url, data, function(timings) {
					resolve(timings);
				});
			});

			return promise;
		};
	}());

	const getSubwayRoutes = (function() {
		const url = `${baseUrl}/subway/routes`;

		return function() {
			const promise = new Promise(function(resolve, reject) {
				$.getJSON(url, function(routes) {
					resolve(routes);
				});
			});

			return promise;
		}
	}());

	const getSubwayTimings = (function() {
		const url = `${baseUrl}/subway`;

		return function(id) {
			const data = {
				id: id
			};

			const promise = new Promise(function(resolve, reject) {
				$.getJSON(url, data, function(timings) {
					resolve(timings);
				});
			});
		}
	}());

	const getDatetime = (function() {
		const url = `${baseUrl}/datetime`;

		return function() {
			const promise = new Promise(function(resolve, reject) {
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
