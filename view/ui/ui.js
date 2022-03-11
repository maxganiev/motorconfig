import { areaFilter, btn, checkboxConicShaft } from '../ux/global_dom';

export function setTransforms(htmlElem, transformVal, transformDir) {
	htmlElem.style.transform = `translate${transformDir}(${transformVal})`;
}

export const mask = {
	createMask: function () {
		this.mask = document.createElement('div');
		this.mask.setAttribute('class', 'mask');

		areaFilter.insertAdjacentElement('afterend', this.mask);
	},
	getMaskParams: function () {
		this.mask.style.top = areaFilter.getBoundingClientRect().height + 'px';
		this.mask.style.height = areaFilter.parentElement.clientHeight - areaFilter.clientHeight + 'px';
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
