const router = (function() {
	const parse = () => location.hash
		.substr(1)
		.split(/\//g);

	function navigate() {
		const [stopcode, linetype, linename] = parse();

		if(stopcode) {
			timingController.load(stopcode);
		}
		if(linetype && linename) {
			routesController.get(linetype, linename);
		}
	}

	function getStopcode() {
		const [stopcode] = parse();
		return stopcode;
	}
	function getLine() {
		const [, linetype, linename] = parse();
		return [linetype, linename];
	}

	return {
		navigate,
		getStopcode,
		getLine,
	};
}());
