const router = (function() {
	const oldState = {};

	const parse = () => location.hash
		.substr(1)
		.split(/\//g);

	function navigate() {
		const [code, type, name] = parse();

		if(!type && !name && oldState.type && oldState.name) {
			location.href = `#${code}/${oldState.type}/${oldState.name}`;
			return;
		}

		const newCode = code && oldState.code !== code;
		const newLine = type && name && (oldState.type !== type || oldState.name !== name);

		if(newCode || (code && newLine)) {
			oldState.code = code;
			timingController.load(code, type, name);
		}

		if(newLine) {
			oldState.type = type;
			oldState.name = name;
			routesController.get(type, name);
		}
	}

	function setStopcode(code) {
		const [, type, name] = parse();
		if(type && name) {
			location.href = `#${code}/${type}/${name}`;
		} else {
			location.href = `#${code}`;
		}
	}
	function getStopcode() {
		const [code] = parse();
		return code;
	}
	function getLine() {
		const [, type, name] = parse();
		return [type, name];
	}

	return {
		navigate,
		setStopcode,
		getStopcode,
		getLine,
	};
}());
