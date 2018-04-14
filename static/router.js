const routerInit = () => {
	const oldState = {};

	const parse = () => location.hash
		.substr(1)
		.split(/\//g);

	const navigate = () => {
		const [code, type, name] = parse();

		if(!code && oldState.code) {
			location.href = `#${oldState.code}/${type}/${name}`;
			return;
		}
		if(!type && !name && oldState.type && oldState.name) {
			location.href = `#${code}/${oldState.type}/${oldState.name}`;
			return;
		}

		const newCode = code && oldState.code !== code;
		const newLine = type && name && (oldState.type !== type || oldState.name !== name);

		if(newCode || (code && newLine)) {
			oldState.code = code;
			timingController.load(code, type, name);
			window.scrollTo(0, 0);
		}

		if(newLine) {
			oldState.type = type;
			oldState.name = name;
			routesController.get(type, name);
			window.scrollTo(0, document.querySelector('#routes-container').offsetTop);
		}
	};

	const setStopcode = (code) => {
		const [, type, name] = parse();
		if(type && name) {
			location.href = `#${code}/${type}/${name}`;
		} else {
			location.href = `#${code}`;
		}
	};
	const getStopcode = () => {
		const [code] = parse();
		return code;
	};
	const getLine = () => {
		const [, type, name] = parse();
		return [type, name];
	};

	window.addEventListener('hashchange', navigate);
	window.addEventListener('load', navigate);

	return {
		navigate,
		setStopcode,
		getStopcode,
		getLine,
	};
};
