import {
	inputModel,
	selectorModel,
	selectorRpm,
	selectorPower,
	selectorBrakes,
	selectorPaws,
	checkboxEncoder,
	checkboxConicShaft,
	selectorVentSystem,
	btn,
	input_reverseSelection,
	main,
	areaFilter,
	areaSelection,
	icn_clearInput,
} from './global_dom';
import {
	searchModel,
	getOptions,
	setModelDescription,
	fillUpgradesChart,
	setModelName,
	selectOptionsReversevely,
	models,
	motorCost,
	toPdf,
} from './selectFunctions';
import { optionsConfig } from '../motordata/base_options_list';
import { mask } from '../ui/ui';
import { motorStandartSetter } from './global_vars';
import { ls_keepStandardChoice, ls_getBtnSelectorStyle } from '../storage/localStorage';
import { setAlert } from './alert';

export function globeEvHandler() {
	ls_getBtnSelectorStyle();

	//selecting motor standard:
	btn.selectorMotor_5ai.onclick = btn.selectorMotor_din.onclick = (e) => {
		switch (e.target.id) {
			case 'btn-5ai-select':
				if (Array.from(e.target.classList).some((className) => className.includes('btn-option-non-selected'))) {
					btn.selectorMotor_din.classList.replace('btn-option-selected', 'btn-option-non-selected');
					e.target.classList.replace('btn-option-non-selected', 'btn-option-selected');
					checkboxConicShaft.parentElement.classList.remove('listItem-hidden');

					motorStandartSetter.setMotorStandart(e.target.id);
					inputModel.value = '5АИ ';
					ls_keepStandardChoice('5AI');
					mask.mask !== undefined && typeof mask.mask !== 'undefined' && mask.getMaskParams();
					e.preventDefault();
				}

				break;

			case 'btn-din-select':
				if (Array.from(e.target.classList).some((className) => className.includes('btn-option-non-selected'))) {
					btn.selectorMotor_5ai.classList.replace('btn-option-selected', 'btn-option-non-selected');
					e.target.classList.replace('btn-option-non-selected', 'btn-option-selected');
					checkboxConicShaft.parentElement.classList.add('listItem-hidden');

					motorStandartSetter.setMotorStandart(e.target.id);
					inputModel.value = 'ESQ ';
					ls_keepStandardChoice('ESQ');
					mask.mask !== undefined && typeof mask.mask !== 'undefined' && mask.getMaskParams();
					e.preventDefault();
				}

				break;
		}
	};

	//convert currency rate:
	btn.btn_currencyConverter.onclick = (e) => {
		e.preventDefault();

		motorCost.convertCurrency(e.target.getAttribute('data-itemid'));
		e.target.setAttribute('data-itemid', e.target.getAttribute('data-itemid') === 'KZT' ? 'RUB' : 'KZT');
		e.target.title = `Конвертировать в ${e.target.getAttribute('data-itemid') === 'KZT' ? 'тенге' : 'рубли'}`;
		e.target.style.background = `url("/image/catalog/adchr/${
			e.target.getAttribute('data-itemid') === 'KZT' ? 'kz' : 'ru'
		}.svg") center center/cover`;
	};

	//expand prices:
	btn.btn_expandOffer.onclick = (e) => {
		e.preventDefault();
		motorCost.expandPricelist();
	};

	//convert DOM to pdf:
	btn.btn_toPdf.onclick = (e) => {
		e.preventDefault();
		toPdf();
	};

	//searching for a model against input:
	inputModel.oninput = (e) => {
		if (input_reverseSelection.value.length !== 0) {
			input_reverseSelection.value = '';
		}

		icn_clearInput.style.visibility = e.target.value.length !== 0 ? 'visible' : 'hidden';

		setTimeout(() => {
			searchModel(e);
		}, 700);
	};

	//clear input:
	icn_clearInput.onclick = (e) => {
		inputModel.value = '';
		btn.selectorMotor_5ai.disabled = btn.selectorMotor_din.disabled = false;
		e.target.style.visibility = 'hidden';
	};

	//searching for a specific model agains choice of rpm or voltage:
	selectorPower.onchange = selectorRpm.onchange = (e) => {
		if (input_reverseSelection.value.length !== 0) {
			input_reverseSelection.value = '';
		}

		e.target.value !== '-' && searchModel(e);
		btn.selectorMotor_5ai.disabled = btn.selectorMotor_din.disabled =
			e.target.id === 'input-model' && e.target.value !== '' ? true : false;
	};

	//selecting a motor model:
	selectorModel.addEventListener('change', () => {
		getOptions([selectorBrakes, selectorPaws, selectorVentSystem], 'resetOptionsList');
	});

	//selecting a paw type:
	selectorPaws.addEventListener('change', () => {
		getOptions(null);
	});

	//selecting a breaks type:
	selectorBrakes.addEventListener('change', (e) => {
		getOptions([selectorVentSystem], 'resetOptionsList');

		const selOptionId = Array.from(e.target.children)
			.find((child) => child.innerText === e.target.value)
			.getAttribute('data-itemid');

		if (e.target.value !== '-') {
			setModelDescription('addData', selOptionId);
		} else {
			setModelDescription('removeData', selOptionId);
		}
	});

	//selecting vent system type:
	selectorVentSystem.addEventListener('change', (e) => {
		getOptions([selectorBrakes], 'resetOptionsList');

		//перезаливка свойств selected для ip:
		const selectorIp = document.getElementById('selector-ip');

		e.target.value !== '-' &&
			Array.from(selectorIp.children).forEach((child, index) => {
				child.selected = optionsConfig.ipVersion[index].selectedByDefault;
			});

		const selOptionId = Array.from(e.target.children)
			.find((child) => child.innerText === e.target.value)
			.getAttribute('data-itemid');

		if (e.target.value !== '-') {
			setModelDescription('addData', selOptionId);
		} else {
			setModelDescription('removeData', selOptionId);
		}

		//refilling ip description when choosing a new type of vent:
		const selOptionIdOptionIP = Array.from(selectorIp.children)
			.find((child) => child.innerText === selectorIp.value)
			.getAttribute('data-itemid');

		getOptions(null);
		setModelDescription('addData', selOptionIdOptionIP);
	});

	//choosing encoder:
	checkboxEncoder.addEventListener('change', (e) => {
		getOptions([selectorBrakes], 'resetOptionsList');
	});

	//chosing conic shaft:
	checkboxConicShaft.addEventListener('change', (e) => {
		getOptions(null);

		if (e.target.checked) {
			setModelDescription('addData', e.target.id);
		} else {
			setModelDescription('removeData', e.target.id);
		}
	});

	//обработчики с делегированием:
	document.body.addEventListener('change', (e) => {
		if (e.target.id === 'checkbox-vibrosensors') {
			if (e.target.checked) {
				e.target.classList.replace('checkbox-vibrosensors-unchecked', 'checkbox-vibrosensors-checked');

				setModelDescription('addData', e.target.id);
			} else {
				e.target.classList.replace('checkbox-vibrosensors-checked', 'checkbox-vibrosensors-unchecked');

				setModelDescription('removeData', e.target.id);
			}
			getOptions(null);
		}

		if (e.target.id === 'checkbox-antiCondenseHeater') {
			if (e.target.checked) {
				e.target.classList.replace('checkbox-antiCondenseHeater-unchecked', 'checkbox-antiCondenseHeater-checked');

				setModelDescription('addData', e.target.id);
			} else {
				e.target.classList.replace('checkbox-antiCondenseHeater-checked', 'checkbox-antiCondenseHeater-uchecked');

				setModelDescription('removeData', e.target.id);
			}
			getOptions(null);
		}

		////encoder group:
		if (e.target.id === 'selector-encoderVoltage') {
			fillUpgradesChart();
			setModelName();
		}

		if (e.target.id === 'selector-outputSignal') {
			fillUpgradesChart();
			setModelName();
		}
		////

		//currentInsulatingBearing:
		if (e.target.id === 'checkbox-currentInsulatingBearing') {
			getOptions(null);

			if (Array.from(e.target.classList).some((className) => className.includes('-checked'))) {
				e.target.checked = false;

				e.target.classList.replace(
					'checkbox-currentInsulatingBearing-checked',
					'checkbox-currentInsulatingBearing-unchecked'
				);
				setModelDescription('removeData', e.target.id);
			} else if (Array.from(e.target.classList).some((className) => className.includes('-unchecked'))) {
				e.target.checked = true;

				e.target.classList.replace(
					'checkbox-currentInsulatingBearing-unchecked',
					'checkbox-currentInsulatingBearing-checked'
				);
				setModelDescription('addData', e.target.id);
			}
		}

		//importBearings:
		if (e.target.id === 'selector-importBearings') {
			getOptions(null);

			const selOptionId = Array.from(e.target.children)
				.find((child) => child.innerText === e.target.value)
				.getAttribute('data-itemid');

			if (e.target.value !== '-') {
				setModelDescription('addData', selOptionId);
			} else {
				setModelDescription('removeData', selOptionId);
			}
		}

		//climateCat:
		if (e.target.id === 'selector-climateCat') {
			const selOptionIdOptionIP = Array.from(e.target.children)
				.find((child) => child.innerText === e.target.value)
				.getAttribute('data-itemid');

			setModelDescription('addData', selOptionIdOptionIP);
			getOptions(null);
		}

		//IP:
		if (e.target.id === 'selector-ip') {
			const selOptionId = Array.from(e.target.children)
				.find((child) => child.innerText === e.target.value)
				.getAttribute('data-itemid');

			setModelDescription('addData', selOptionId);
			fillUpgradesChart();

			//перезаливка опций для системы вентиляции при смене IP:
			getOptions([selectorVentSystem], 'resetOptionsList');
		}

		//package:
		if (e.target.id === 'checkbox-package') {
			getOptions(null);
		}
	});

	areaSelection.onclick = areaFilter.onclick = () => {
		//hide modals:
		Array.from(main.children).some((child) => child.id === 'list-pricelist-expanded') &&
			document.getElementById('list-pricelist-expanded').remove();
	};

	document.body.addEventListener('click', (e) => {
		//options-sensors:
		if (e.target.id.includes('btn-options-sensors-id')) {
			if (Array.from(e.target.classList).some((className) => className.includes('btn-option-non-selected'))) {
				e.target.classList.replace('btn-option-non-selected', 'btn-option-selected');

				const list = e.target.parentElement.parentElement;

				Array.from(list.children).forEach((child) => {
					const btn = child.firstElementChild;
					btn.id !== e.target.id && btn.classList.replace('btn-option-selected', 'btn-option-non-selected');
				});

				setModelDescription(
					'addData',
					Array.from(e.target.classList).find((cl) => cl.includes('Б'))
				);
			} else if (Array.from(e.target.classList).some((className) => className.includes('btn-option-selected'))) {
				e.target.classList.replace('btn-option-selected', 'btn-option-non-selected');

				setModelDescription(
					'removeData',
					Array.from(e.target.classList).find((cl) => cl.includes('Б'))
				);
			}
			getOptions(null);
		}

		//hide pricelist if expanded:
		if (e.target.id === 'icn-close-pricelist') {
			e.target.parentElement.parentElement.remove();
		}
	});

	document.body.addEventListener('input', (e) => {
		//encoderResOptions
		if (e.target.id === 'input-encoderResOptions') {
			fillUpgradesChart();
			setModelName();
		}
	});

	//reverse options selection:
	btn.btn_reverseSelection.onclick = async (e) => {
		const input = input_reverseSelection.value.slice(
			0,
			input_reverseSelection.value.indexOf('-', input_reverseSelection.value.indexOf('/'))
		);

		if (
			(motorStandartSetter.selected === '5AI' && input.toUpperCase().includes('ESQ')) ||
			(motorStandartSetter.selected === 'ESQ' && input.toUpperCase().includes('5АИ')) ||
			(!input.toUpperCase().includes('ESQ') && !input.toUpperCase().includes('5АИ'))
		) {
			mask.createMask('/image/catalog/adchr/ban.svg');
			mask.getMaskParams();

			setAlert('err-fillDetails', 'Модель не найдена, скорректируйте поиск или выберите корректный тип двигателя');
		} else {
			const modelName =
				motorStandartSetter.selected === '5AI'
					? input
							.split(' ')
							.filter((item) => item.indexOf('/') === -1)
							.join(' ')
					: input;

			if (input !== selectorModel.value) {
				await models.getModel(modelName);
			}

			selectorModel.children.length > 1 && selectOptionsReversevely(e);
		}
	};

	//decoder input control:
	input_reverseSelection.onkeydown = (e) => {
		if (inputModel.value.length !== 0 || selectorPower !== '-' || selectorRpm !== '-') {
			inputModel.value = '';
			selectorPower.children[0].selected = selectorRpm.children[0].selected = true;
		}

		selectorPower.value = selectorRpm.value = '-';
		btn.selectorMotor_5ai.disabled = btn.selectorMotor_din.disabled = false;

		const permitted1 = ['v', 'a', 'c', 'x', 'z', 'r'];
		const permitted2 = ['Tab', 'Control', 'Alt', 'Shift', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Backspace'];

		if (e.ctrlKey) {
			permitted1.indexOf(e.key) !== -1 && e.key !== 'Control' && true;
		} else {
			if (permitted2.indexOf(e.key) !== -1 && e.key !== 'Control') {
				if (e.key === 'Backspace') {
					e.target.value = '';
				}
				return true;
			} else {
				setAlert('err-fillDetails', 'Разрешены только копирование и вставка!');
				e.preventDefault();
				e.target.blur();
			}
		}
	};

	window.onresize = () => {
		mask.mask !== undefined && typeof mask.mask !== 'undefined' && mask.getMaskParams();
	};
}
