const router = routerInit();

linesInit(
	document.querySelector('#lines-container'),
	document.querySelector('#enter-linename'));

const favouritesController = favouritesInit(
	document.querySelector('#favourites-container'),
	'fav_stops');

const routesController = routesInit(
	document.querySelector('#routes-container'));

const timingController = timingInit(
	document.querySelector('#timing-container'),
	document.querySelector('#enter-stopcode'),
	document.querySelector('#timing-format'),
	document.querySelector('#auto-poll'));

router.navigate();
