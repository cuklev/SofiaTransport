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
	document.querySelector('#timing-format'));

router.navigate();

(() => {
	const autoPoll = document.querySelector('#auto-poll');
	let timeout = false;

	const pollNow = () => {
		if(autoPoll.checked && document.hasFocus()) {
			const code = router.getStopcode();
			const [type, name] = router.getLine();
			timingController.get(code, type, name);
			timeout = setTimeout(pollNow, 15000);
		} else {
			timeout = false;
		}
	};

	const schedulePoll = () => {
		if(!timeout) {
			pollNow();
		}
	};

	schedulePoll();

	autoPoll.addEventListener('change', schedulePoll);
	document.addEventListener('focus', schedulePoll);
})();
