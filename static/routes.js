const router = (function() {
	const parse = () => location.hash
		.substr(1)
		.split(/\//g)
		.map(Number);

	function navigate() {
		const [lineid, stopcode] = parse();

		// if(linetype && linename) {
		// 	routesController.get(+linetype, +linename);
		// }

		if(stopcode) {
			timingController.load(+stopcode);
		}
	}

	function getStopcode() {
		const [, stopcode] = parse();
		return stopcode;
	}
	function getLine() {
		const [lineid] = parse();
		return lineid;
	}

	return {
		navigate,
		getStopcode,
		getLine
	};
}());
