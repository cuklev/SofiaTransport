const router = (function() {
	function parse() {
		return location.hash.match(/^#([0-9]*)\/?([0-9]*)\/?([0-9]*)/) || [];
	}

	function navigate() {
		const [, stopcode, linetype, linename] = parse();

		if(linetype && linename) {
			routesController.get(+linetype, +linename);
		}

		if(stopcode) {
			timingController.load(+stopcode);
		}
	}

	function getStopcode() {
		const [, stopcode] = parse();
		return stopcode;
	}
	function getLine() {
		const [, , linetype, linename] = parse();
		return [linetype, linename];
	}

	return {
		navigate,
		getStopcode,
		getLine
	};
}());
