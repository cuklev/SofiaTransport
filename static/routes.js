function navigateRoute() {
	const [, stopcode, linetype, linename] = location.hash.match(/^#([0-9]*)\/?([0-9]*)\/?([0-9]*)/) || [];

	if(linetype && linename) {
		routesController.get(+linetype, +linename);
	}

	if(stopcode) {
		console.log('here', +stopcode);
		timingController.load(+stopcode);
	}
}
