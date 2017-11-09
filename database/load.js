const request = require('request');

const baseUrl = 'https://www.sofiatraffic.bg/interactivecard';

const get = (url, process) => {
	const options = {
		method: 'get',
		url
	};

	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if(err) reject(err);
			resolve(process(body));
		});
	});
};

const getLines = (type) => get(`${baseUrl}/lines/${type}`, x => x.split(/<label for="line/g)
																	.filter((_, i) => i)
																	.map(x => x.split(/[^0-9]+/g))
																	.map(([lineId, lineName]) => ({lineId, lineName})));
const getRoutes = (id) => get(`${baseUrl}/lines/geo?line_id=${id}`, x => JSON.parse(x).features);
const getStops = (id) => get(`${baseUrl}/lines/stops/geo?line_id=${id}`, x => JSON.parse(x).features);

const load = () => Promise.all([1, 2, 3].map(getLines))
		.then(([bus, tramway, trolley]) => ({bus, tramway, trolley}));

//load().then(x => console.log(x));


//getLines(3).then(console.log);
getRoutes(4186).then(console.log);
getStops(4186).then(console.log);

// getLines(3)
// 	.then(x => Promise.all(x.map(y => getRoutes(y.lineId))))
// 	.then(x => console.log(x));
