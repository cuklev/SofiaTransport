const fs = (() => {
	const fs1 = require('fs');
	if(fs1.promises) {
		return fs1.promises;
	}
	// Node < 10 does not have fs.promises
	return {
		writeFile: (file, body) => new Promise((resolve, reject) => fs1.writeFile(file, body, err => err ? reject(err) : resolve())),
		mkdir: (dir, opts) => new Promise((resolve, reject) => fs1.mkdir(dir, opts, err => err ? reject(err) : resolve())),
	};
})();

const get = async (url) => {
	const res = await fetch(url);
	if (!res.ok) {
		throw res.statusText;
	}
	return res;
};

const getText = async (url) => {
	const res = await get(url);
	return res.text();
};

const getJson = async (url) => {
	const res = await get(url);
	return res.json();
};

const tokens = {};

const getCache = async () => {
	await fs.mkdir('static/cache', {recursive: true});

	const response = await get('https://www.sofiatraffic.bg/bg/public-transport');
	const cookies = response.headers.get('set-cookie');
	tokens.xsrf = cookies.match(/XSRF-TOKEN=([^;]*)/)[1];
	tokens.session = cookies.match(/sofia_traffic_session=([^;]*)/)[1];
	console.log('Obtained cookies');

	const html = await response.text();
	const dataPage = html.split('data-page="')[1].split('"')[0];
	const data = JSON.parse(dataPage.replace(/&quot;/g, '"'));

	const transports = {};
	for (const type of data.props.transportTypes) {
		const lines = [];
		transports[type.name] = lines;

		for (const transport of data.props.linesByType[type.id]) {
			lines.push(transport.name);
		}
	}

	await fs.writeFile('static/cache/lines.json', JSON.stringify(transports));
	console.log('Updated lines cache');

	const stops = {};
	for (const {name, code} of data.props.stops) {
		stops[code] = name;
	}

	await fs.writeFile('static/cache/stops.json', JSON.stringify(stops));
	console.log('Updated stops cache');
};

const init = async () => {
	try {
		await getCache();
		setTimeout(init, 24*60*60*1000); // 1 day
	} catch(e) {
		console.error(e);
		setTimeout(init, 10*60*1000); // 10 minutes
	}
};

const getSessionHeaders = () => {
	return {
		'Content-Type': 'application/json',
		'X-XSRF-TOKEN': decodeURIComponent(tokens.xsrf),
		'Cookie': `sofia_traffic_session=${tokens.session}`
	};
};

module.exports = { init, getSessionHeaders };
