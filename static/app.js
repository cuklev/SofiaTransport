const router = routerInit();

linesInit(
	document.querySelector('#lines-container'),
	document.querySelector('#global-search'));

const favouritesController = favouritesInit(
	document.querySelector('#favourites-container'),
	'fav_stops');

const routesController = routesInit(
	document.querySelector('#routes-container'));

const timingController = timingInit(
	document.querySelector('#timing-container'),
	document.querySelector('#timing-format'),
	document.querySelector('#auto-poll'));

searchInit(
	document.querySelector('#global-search'),
	document.querySelector('#routes-container'));
