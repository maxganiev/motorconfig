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
} from './global_dom';
import {
	searchModel,
	getOptions,
	optionsSelector,
	setModelDescription,
	fillUpgradesChart,
	populateOptionsList,
	setModelName,
} from './selectFunctions';
import { optionsConfig } from '../motordata/base_options_list';
import { mask, ls_getBtnSelectorStyle, ls_getScrollPos } from '../ui/ui';
import { motorStandartSetter } from './global_vars';
import { ls_keepStandardChoice, ls_keepScrollPosY } from '../storage/localStorage';

export function globeEvHandler() {
	ls_getScrollPos();
	ls_getBtnSelectorStyle();

	//selecting motor standard:
	btn.selectorMotor_5ai.onclick = btn.selectorMotor_din.onclick = (e) => {
		switch (e.target.id) {
			case 'btn-5ai-select':
				if (Array.from(e.target.classList).some((className) => className.includes('btn-option-non-selected'))) {
					btn.selectorMotor_din.classList.replace('btn-option-selected', 'btn-option-non-selected');
					e.target.classList.replace('btn-option-non-selected', 'btn-option-selected');
					checkboxConicShaft.parentElement.style.display = 'block';

					motorStandartSetter.setMotorStandart(e.target.id);
					ls_keepStandardChoice('5AI');
					mask.mask !== undefined && typeof mask.mask !== 'undefined' && mask.getMaskParams();
					e.preventDefault();
				}

				break;

			case 'btn-din-select':
				if (Array.from(e.target.classList).some((className) => className.includes('btn-option-non-selected'))) {
					btn.selectorMotor_5ai.classList.replace('btn-option-selected', 'btn-option-non-selected');
					e.target.classList.replace('btn-option-non-selected', 'btn-option-selected');
					checkboxConicShaft.parentElement.style.display = 'none';

					motorStandartSetter.setMotorStandart(e.target.id);
					ls_keepStandardChoice('ESQ');
					mask.mask !== undefined && typeof mask.mask !== 'undefined' && mask.getMaskParams();
					e.preventDefault();
				}

				break;
		}
	};

	//searching for a model against input:
	inputModel.oninput = (e) =>
		setTimeout(() => {
			searchModel(e);
		}, 200);

	//searching for a specific model agains choice of rpm or voltage:
	selectorPower.onchange = selectorRpm.onchange = (e) => searchModel(e);

	//selecting a motor model:
	selectorModel.addEventListener('change', () => {
		getOptions([selectorBrakes, selectorPaws, selectorVentSystem], 'resetOptionsList');
		setModelName();
	});

	//selecting a paw type:
	selectorPaws.addEventListener('change', () => {
		getOptions(null);
		setModelName();
	});

	//selecting a breaks type:
	selectorBrakes.addEventListener('change', (e) => {
		getOptions([selectorVentSystem], 'resetOptionsList');

		const selOptionId = Array.from(e.target.children)
			.find((child) => child.innerText === e.target.value)
			.getAttribute('data-itemid');

		if (e.target.value !== '-') {
			setModelDescription('addData', 'electroMagneticBreak', selOptionId);
		} else {
			setModelDescription('removeData', null, selOptionId);
		}

		fillUpgradesChart();
		setModelName();
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
			setModelDescription('addData', 'ventSystem', selOptionId);
		} else {
			setModelDescription('removeData', null, selOptionId);
		}

		fillUpgradesChart();

		//refilling ip description when choosing a new type of vent:
		const selOptionIdOptionIP = Array.from(selectorIp.children)
			.find((child) => child.innerText === selectorIp.value)
			.getAttribute('data-itemid');

		setModelDescription('addData', 'ipVersion', selOptionIdOptionIP);
		setModelName();
	});

	//choosing encoder:
	checkboxEncoder.addEventListener('change', (e) => {
		getOptions([selectorBrakes], 'resetOptionsList');
		setModelDescription();
		fillUpgradesChart();
		setModelName();
	});

	//chosing conic shaft:
	checkboxConicShaft.addEventListener('change', (e) => {
		getOptions(null);

		if (e.target.checked) {
			setModelDescription('addData', 'conicShaft', e.target.id);
		} else {
			setModelDescription('removeData', null, e.target.id);
		}
		setModelName();
	});

	//обработчики с делегированием:
	document.body.addEventListener('change', (e) => {
		if (e.target.id === 'checkbox-vibrosensors') {
			if (e.target.checked) {
				e.target.classList.replace('checkbox-vibrosensors-unchecked', 'checkbox-vibrosensors-checked');

				setModelDescription('addData', 'vibroSensors', e.target.id);
			} else {
				e.target.classList.replace('checkbox-vibrosensors-checked', 'checkbox-vibrosensors-unchecked');

				setModelDescription('removeData', null, e.target.id);
			}
			setModelName();
		}

		if (e.target.id === 'checkbox-antiCondenseHeater') {
			if (e.target.checked) {
				e.target.classList.replace('checkbox-antiCondenseHeater-unchecked', 'checkbox-antiCondenseHeater-checked');

				setModelDescription('addData', 'antiCondensingHeater', e.target.id);
			} else {
				e.target.classList.replace('checkbox-antiCondenseHeater-checked', 'checkbox-antiCondenseHeater-uchecked');

				setModelDescription('removeData', null, e.target.id);
			}
			setModelName();
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
			optionsSelector.setOptionsList();

			if (Array.from(e.target.classList).some((className) => className.includes('-checked'))) {
				e.target.checked = false;

				e.target.classList.replace(
					'checkbox-currentInsulatingBearing-checked',
					'checkbox-currentInsulatingBearing-unchecked'
				);
				setModelDescription('removeData', null, e.target.id);
			} else if (Array.from(e.target.classList).some((className) => className.includes('-unchecked'))) {
				e.target.checked = true;

				e.target.classList.replace(
					'checkbox-currentInsulatingBearing-unchecked',
					'checkbox-currentInsulatingBearing-checked'
				);
				setModelDescription('addData', 'currentInsulatingBearing', e.target.id);
			}
			setModelName();
		}

		//importBearings:
		if (e.target.id === 'selector-importBearings') {
			optionsSelector.setOptionsList();

			const selOptionId = Array.from(e.target.children)
				.find((child) => child.innerText === e.target.value)
				.getAttribute('data-itemid');

			if (e.target.value !== '-') {
				setModelDescription('addData', 'importBearings', selOptionId);
			} else {
				setModelDescription('removeData', null, selOptionId);
			}

			setModelName();
		}

		//climateCat:
		if (e.target.id === 'selector-climateCat') {
			const selOptionIdOptionIP = Array.from(e.target.children)
				.find((child) => child.innerText === e.target.value)
				.getAttribute('data-itemid');

			setModelDescription('addData', 'climateCat', selOptionIdOptionIP);
			setModelName();
		}

		//IP:
		if (e.target.id === 'selector-ip') {
			const selOptionId = Array.from(e.target.children)
				.find((child) => child.innerText === e.target.value)
				.getAttribute('data-itemid');

			setModelDescription('addData', 'ipVersion', selOptionId);
			fillUpgradesChart();

			//перезаливка опций для системы вентиляции при смене IP:
			const { frameSize, encoderIsChecked, ventSystemOptionValue, brakeType } = optionsSelector;

			optionsConfig.fillBaseOptions(
				frameSize,
				encoderIsChecked,
				ventSystemOptionValue,
				brakeType,
				document.getElementById('checkbox-currentInsulatingBearing').checked,
				document.getElementById('selector-importBearings').value,
				e.target.value
			);

			populateOptionsList([selectorVentSystem], [optionsConfig.ventSystem], 'resetOptionsList');
			setModelName();
		}

		//package:
		if (e.target.id === 'checkbox-package') {
			console.log('checkbox-package', e.target.value);
		}
	});

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
					'tempDataSensors',
					Array.from(e.target.classList).find((cl) => cl.includes('Б'))
				);
			} else if (Array.from(e.target.classList).some((className) => className.includes('btn-option-selected'))) {
				e.target.classList.replace('btn-option-selected', 'btn-option-non-selected');

				setModelDescription(
					'removeData',
					null,
					Array.from(e.target.classList).find((cl) => cl.includes('Б'))
				);
			}
			setModelName(e.target.tagName);
		}
	});

	document.body.addEventListener('input', (e) => {
		//encoderResOptions
		if (e.target.id === 'input-encoderResOptions') {
			setModelDescription();
			fillUpgradesChart();
			setModelName();
		}
	});

	window.onresize = () => {
		mask.mask !== undefined && typeof mask.mask !== 'undefined' && mask.getMaskParams();
	};

	window.onbeforeunload = () => ls_keepScrollPosY(document.documentElement.scrollTop);
}
