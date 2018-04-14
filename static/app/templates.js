const templates = (function() {
	const cache = {};
	const handlebars = window.Handlebars || window.handlebars;

	const get = async (name) => {
		if(cache[name]) {
			return cache[name];
		}

		const hb = await request.get(`./templates/${name}.handlebars`);
		const hbCompiled = handlebars.compile(hb);
		cache[name] = hbCompiled;
		return hbCompiled;
	};

	return {
		get,
	};
}());
