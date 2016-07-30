var sumc = (function() {
	var baseUrl = 'sumcapi';

	function getTiming(stopcode) {
		var data = {
			stopCode: stopcode
		};

		var promise = new Promise(function(resolve, reject) {
			$.get(baseUrl + '/timing', data, function(timings) {
				resolve(timings);
			});
		});

		return promise;
	};

	function getDatetime() {
		var promise = new Promise(function(resolve, reject) {
			$.get(baseUrl + '/datetime', function(datetime) {
				resolve(datetime);
			});
		});
	}

	return {
		getTiming: getTiming,
		getDatetime: getDatetime
	};
}());
