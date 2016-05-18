var sumc = (function() {
	var baseUrl = 'sumcapi';

	function getTiming(stopcode) {
		var data = {
			stopCode: stopcode
		};

		var promise = new Promise(function(resolve, reject) {
			$.post(baseUrl + '/timing', data, function(timings) {
				resolve(timings);
			});
		});

		return promise;
	};

	return {
		getTiming: getTiming
	};
}());
