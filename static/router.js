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

	function setStopcode(code) {
		const [, linetype, linename] = parse();
		if(linetype && linename) {
			location.href = `#${code}/${linetype}/${linename}`;
		} else {
			location.href = `#${code}`;
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
		setStopcode,
		getStopcode,
		getLine,
	};
}());
