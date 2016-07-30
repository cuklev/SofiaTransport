var db = (function() {
	var getStopname = (function() {
		var url = 'api/stopname';
		var cache = {};

		return function(stopcode) {
			var promise = new Promise(function(resolve, reject) {
				if(cache[stopcode]) {
					resolve(cache[stopcode]);
					return;
				}

				var data = {
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

	var getRoutes = (function() {
		var url = 'api/routes';
		var cache = {}; // is array better?

		return function(line) {
			var promise = new Promise(function(resolve, reject) {
				if(!cache[line.type]) {
					cache[line.type] = {};
				}
				else if(cache[line.type][line.name]) {
					resolve(cache[line.type][line.name]);
					return;
				}

				var data = {
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

	var getPoints = (function(line) {
		var url = 'api/points';
		var cache = {}; // is array better?

		return function() {
			var promise = new Promise(function(resolve, reject) {
				if(!cache[line.type]) {
					cache[line.type] = {};
				}
				else if(cache[line.type][line.name]) {
					resolve(cache[line.type][line.name]);
					return;
				}

				var data = {
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
