const templates = (function() {
	const cache = {};
	const handlebars = Handlebars;

	function get(name) {
		const promise = new Promise(function(resolve, reject) {
			if(cache[name]) {
				resolve(cache[name]);
				return;
			}

			const url = './templates/' + name + '.handlebars';

			$.get(url, function(hb) {
				const html = handlebars.compile(hb);
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
