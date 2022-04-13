import { main } from './global_dom';

export const setAlert = (type, msg, timeout) => {
	if (Array.from(main.children).some((child) => child.className.includes('alert'))) {
		return;
	}

	const alert = document.createElement('div');
	switch (type) {
		case 'err-fillDetails':
			alert.setAttribute('class', 'alert alert-danger d-flex align-items-center');
			alert.innerHTML = `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg> ${msg}`;
			break;

		case 'success':
			alert.setAttribute('class', 'alert alert-success d-flex align-items-center');
			alert.innerHTML = `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg> ${msg}`;
			break;

		case 'info':
			alert.setAttribute('class', 'alert alert-primary d-flex align-items-center');
			alert.innerHTML = `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg> ${msg}`;
			break;
	}

	main.insertAdjacentElement('afterbegin', alert);

	if (timeout === undefined || typeof timeout === 'undefined') {
		timeout = 2000;
	}

	setTimeout(() => {
		alert.style.opacity = 0;
		alert.style.transition = 'opacity 0.6s ease-out';

		setTimeout(() => {
			alert.remove();
		}, 650);
	}, timeout);
};
