const db = (function() {
	const getStopname = (function() {
		const url = 'api/stopname';
		const cache = {};

		return function(stopcode) {
			const promise = new Promise(function(resolve, reject) {
				if(cache[stopcode]) {
					resolve(cache[stopcode]);
					return;
				}

				const data = {
					stopcode: stopcode
				};

				$.get(url, data, function(stopname) {
					cache[stopcode] = stopname;
					resolve(stopname);
				});
			});

			return promise;
		}
	}());

	const getLines = (function() {
		const url = 'api/lines';
		const cache;

		return function() {
			const promise = new Promise(function(resolve, reject) {
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

	const getRoutes = (function() {
		const url = 'api/routes';
		const cache = {}; // is array better?

		return function(line) {
			const promise = new Promise(function(resolve, reject) {
				if(!cache[line.type]) {
					cache[line.type] = {};
				}
				else if(cache[line.type][line.name]) {
					resolve(cache[line.type][line.name]);
					return;
				}

				const data = {
					linetype: line.type,
					linename: line.name
				};

				$.get(url, data, function(routes) {
					cache[line.type][line.name] = routes;
					resolve(routes);
				});
			});

			return promise;
		}
	}());

	const getPoints = (function(line) {
		const url = 'api/points';
		const cache = {}; // is array better?

		return function() {
			const promise = new Promise(function(resolve, reject) {
				if(!cache[line.type]) {
					cache[line.type] = {};
				}
				else if(cache[line.type][line.name]) {
					resolve(cache[line.type][line.name]);
					return;
				}

				const data = {
					linetype: line.type,
					linename: line.name
				};

				$.get(url, data, function(points) {
					cache[line.type][line.name] = points;
					resolve(points);
				});
			});

			return promise;
		}
	}());

	return {
		getStopname: getStopname,
		getLines: getLines,
		getRoutes: getRoutes,
		getPoints: getPoints
	};
}());
