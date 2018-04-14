const request = {};

request.get = (url) => new Promise((resolve, reject) => {
	const r = new XMLHttpRequest();
	r.open('GET', url, true);

	r.onload = () => {
		if (r.status >= 200 && r.status < 400) {
			resolve(r.responseText);
		} else {
			reject(r.responseText);
		}
	};

	r.onerror = reject;

	r.send();
});

request.getJSON = (url) => request.get(url).then(JSON.parse);
