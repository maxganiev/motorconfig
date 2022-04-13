import { areaFilter, main } from '../ux/global_dom';

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
		this.mask.style.backgroundColor = imgUrl.includes('spinner') ? 'rbga(250, 250, 250, 0.6)' : 'rgba(0, 0, 0, 0.9)';

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

export function recalculateHeight(parentElem) {
	parentElem.style.height = Array.from(parentElem.children).reduce((acc, curr) => acc + curr.clientHeight, 0) * 1.15 + 'px';
	main.style.height = '100%';
}
