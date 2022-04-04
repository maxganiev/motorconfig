import { areaFilter, btn, checkboxConicShaft, main } from '../ux/global_dom';

export function setTransforms(htmlElem, transformVal, transformDir) {
	htmlElem.style.transform = `translate${transformDir}(${transformVal})`;
}

export const mask = {
	createMask: function (imgUrl) {
		this.removeMask();

		this.mask = document.createElement('div');
		this.mask.setAttribute('class', 'mask');
		this.mask.innerHTML = `<img src="${imgUrl}" class="${
			imgUrl.includes('spinner') ? 'img-status spinner' : 'img-status'
		}" alt="temp image" />`;

		areaFilter.insertAdjacentElement('afterend', this.mask);
	},
	getMaskParams: function () {
		this.mask.style.top = areaFilter.getBoundingClientRect().height + 'px';
		this.mask.style.height = areaFilter.parentElement.clientHeight - areaFilter.clientHeight + 'px';
	},
	removeMask: function () {
		this.mask !== null && this.mask != undefined && this.mask.remove();
	},
};

export function ls_getBtnSelectorStyle() {
	const { selectorMotor_din, selectorMotor_5ai } = btn;

	switch (localStorage.getItem('standard-selected')) {
		case null:
			break;

		case '5AI':
			selectorMotor_din.classList.replace('btn-option-selected', 'btn-option-non-selected');
			selectorMotor_5ai.classList.replace('btn-option-non-selected', 'btn-option-selected');
			checkboxConicShaft.parentElement.style.display = 'block';
			break;

		case 'ESQ':
			selectorMotor_din.classList.replace('btn-option-non-selected', 'btn-option-selected');
			selectorMotor_5ai.classList.replace('btn-option-selected', 'btn-option-non-selected');
			checkboxConicShaft.parentElement.style.display = 'none';
			break;
	}
}

export function ls_getScrollPos() {
	if (localStorage.getItem('scrollPosY') === null) {
		return;
	} else {
		setTimeout(() => {
			window.scrollTo(0, localStorage.getItem('scrollPosY'));
		}, 10);
	}
}

export function recalculateHeight(parentElem) {
	parentElem.style.height = Array.from(parentElem.children).reduce((acc, curr) => acc + curr.clientHeight, 0) * 1.15 + 'px';
	main.style.height = '100%';
	console.log(parentElem.clientHeight);
}
