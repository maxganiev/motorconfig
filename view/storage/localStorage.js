import { inputModel, btn, checkboxConicShaft } from '../ux/global_dom';

export function ls_keepStandardChoice(motorStandard) {
	localStorage.setItem('standard-selected', motorStandard);
}

export function ls_getBtnSelectorStyle() {
	const { selectorMotor_din, selectorMotor_5ai } = btn;

	switch (localStorage.getItem('standard-selected')) {
		case null:
			break;

		case '5AI':
			selectorMotor_din.classList.replace('btn-option-selected', 'btn-option-non-selected');
			selectorMotor_5ai.classList.replace('btn-option-non-selected', 'btn-option-selected');
			checkboxConicShaft.parentElement.classList.remove('listItem-hidden');
			inputModel.value = '5АИ ';
			break;

		case 'ESQ':
			selectorMotor_din.classList.replace('btn-option-non-selected', 'btn-option-selected');
			selectorMotor_5ai.classList.replace('btn-option-selected', 'btn-option-non-selected');
			checkboxConicShaft.parentElement.classList.add('listItem-hidden');
			inputModel.value = 'ESQ ';
			break;
	}
}
