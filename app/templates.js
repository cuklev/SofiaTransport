var templates = (function() {
	var cache = {};
	var handlebars = Handlebars;

	function get(name) {
		var promise = new Promise(function(resolve, reject) {
			if(cache[name]) {
				resolve(cache[name]);
				return;
			}

			var url = './templates/' + name + '.handlebars';

			$.get(url, function(hb) {
				var html = handlebars.compile(hb);
				cache[name] = html;
				resolve(html);
			});
		});

		return promise;
	}

	return {
		get: get
	};
}());
