const request = require('request');
const fs = require('fs').promises;

const baseUrl = 'https://routes.sofiatraffic.bg/resources';

const get = async (url) => {
	const options = {
		method: 'get',
		url
	};

	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if(err) reject(err);
			resolve(body);
		});
	});
};

const cacheFile = async (file) => {
	const response = await get(`${baseUrl}/${file}`);
	await fs.writeFile(`static/cache/${file}`, response);
};

const load = async () => {
	await fs.mkdir('static/cache', {recursive: true});
	console.log('Caching routes.json');
	await cacheFile('routes.json');
	console.log('Caching stops-bg.json');
	await cacheFile('stops-bg.json');
};

const setReload = (timeout) => {
	const reload = () => load()
		.then(() => setTimeout(reload, timeout));
	reload();
};

module.exports = {
	load,
	setReload,
};
