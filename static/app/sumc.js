const sumc = (function() {
	const baseUrl = 'api';

	const getTiming = function(code) {
		const url = `${baseUrl}/timing/${code}`;
		const promise = new Promise(function(resolve, reject) {
			$.get(url, function(timings) {
				resolve(JSON.parse(timings));
			});
		});

		return promise;
	};

	// OLD API!!!
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

	// OLD API!!!
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

	// OLD API!!!
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

	// OLD API!!!
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
