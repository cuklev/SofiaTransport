var db = (function() {
	var url = '/api/stopname';

	function getStopname(stopcode) {
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

	return {
		getStopname: getStopname
	};
}());
