var sumc = (function() {
	//var baseUrl = 'http://drone.sumc.bg/api';
	var baseUrl = 'api/';

	var getTiming = function(stopcode) {
		var data = {
			stopCode: stopcode
		};

		var promise = new Promise(function(resolve, reject) {
			$.post(baseUrl + '/v1/timing', data, function(timings) {
				resolve(timings);
			});
		});

		return promise;
	};

	return {
		getTiming: getTiming
	};
}());
