const routerInit = () => {
	const selectionStyles = document.querySelector('#selection-styles');

	const oldState = {};

	const parse = () => location.hash
		.substr(1)
		.split(/\//g)
		.map(decodeURIComponent);

	const navigate = async () => {
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

		if (newLine) {
			oldState.type = type;
			oldState.name = name;
			await routesController.get(type, name);

			if (!code) {
				window.scrollTo(0, document.querySelector('#routes-container').offsetTop);
			}
		}

		if (newCode || (code && newLine)) {
			oldState.code = code;
			await timingController.load(code, type, name);
		}

		if (newCode) {
			window.scrollTo(0, document.querySelector('#timing-container').offsetTop);
		}

		const styles = [];
		if (type && name) {
			styles.push(`
.${type}[data-line-name="${name}"] {
	background-color: var(--${type}-color);
	color: white;
}`);
		}
		if (code) {
			styles.push(`
[data-stop-code="${code}"] > a {
	font-weight: bold;
	text-decoration: underline;
}`);
		}

		selectionStyles.innerText = styles.join('');
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
