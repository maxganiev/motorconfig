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
	imageDrawing,
	chart_connectionParams,
	areaSelection,
	areaRender,
	listItemUpgrades,
	areaFilter,
	h2ModelName,
	btn,
	input_reverseSelection,
} from './global_dom';
import { optionsConfig } from '../motordata/base_options_list';
import { regex, motorStandartSetter } from './global_vars';
import { imgSrcData, setImgSrcData } from '../motordata/imgSrcData';
import { fillExtraOptions, showWarning } from '../motordata/extra_options_list';
import { setTransforms, mask } from '../ui/ui';

//получение списка моделей и очистка UI:
export function searchModel(e) {
	const filteredResults = [];

	if (e.target.id === 'input-model') {
		getModel(e.target.value, filteredResults);
		selectorBrakes.value = selectorPower.value = selectorRpm.value = selectorPaws.value = selectorVentSystem.value = '-';
		checkboxEncoder.checked = checkboxConicShaft.checked = false;
		if (
			document.getElementById('checkbox-vibrosensors') !== null &&
			document.getElementById('checkbox-antiCondenseHeater') !== null
		) {
			document.getElementById('checkbox-vibrosensors').checked = document.getElementById(
				'checkbox-antiCondenseHeater'
			).checked = false;
		}

		//hiding/showing motor type select btns:
		btn.selectorMotor_5ai.parentElement.style.visibility = e.target.value !== '' ? 'hidden' : 'visible';
	} else {
		getModel([selectorPower.value, selectorRpm.value], filteredResults);
		selectorBrakes.value = selectorPaws.value = selectorVentSystem.value = '-';
		checkboxEncoder.checked = checkboxConicShaft.checked = false;

		if (
			document.getElementById('checkbox-vibrosensors') !== null &&
			document.getElementById('checkbox-antiCondenseHeater') !== null
		) {
			document.getElementById('checkbox-vibrosensors').checked = document.getElementById(
				'checkbox-antiCondenseHeater'
			).checked = false;
		}

		//hiding/showing motor type select btns:
		btn.selectorMotor_5ai.parentElement.style.visibility =
			selectorPower.value !== '-' || selectorRpm.value !== '-' ? 'hidden' : 'visible';
	}

	//cleaning up selector options list while typing or re-selecting:
	Array.from(selectorBrakes.children).forEach((child, index) => index !== 0 && child.remove());
	Array.from(selectorVentSystem.children).forEach((child, index) => index !== 0 && child.remove());
	Array.from(selectorPaws.children).forEach((child) => child.remove());

	//cleaning up encoder options list if it was not unchecked before typing for a new model:
	Array.from(areaSelection.children).some((child) => child.id.includes('encoder-group-id') && child.remove());

	//cleaning up all description from area render:
	Array.from(document.querySelector('.chart-description').children).forEach(
		(child) => child.id !== 'listItem-upgrades' && child.remove()
	);

	//setting btn UI used for tempDataSensors selection back to default while typing:
	Array.from(document.querySelectorAll('.btn-option-selected')).forEach(
		(btn) =>
			btn.id !== 'btn-5ai-select' &&
			btn.id !== 'btn-din-select' &&
			btn.classList.replace('btn-option-selected', 'btn-option-non-selected')
	);

	//setting upgrades chart to default while typing:
	Array.from(listItemUpgrades.children).forEach((child) => child.remove());

	//replacing all checkboxes (except one ref. currentInsulating bearing) classes from checked to unchecked if any:
	Array.from(areaSelection.children).forEach((child) => {
		if (child.children.length > 0) {
			Array.from(child.children).forEach((elem) => {
				elem.tagName === 'INPUT' &&
					elem.getAttribute('type') === 'checkbox' &&
					elem.id !== 'checkbox-currentInsulatingBearing' &&
					elem.classList.replace(`${elem.id}-checked`, `${elem.id}-unchecked`);
			});
		}
	});
}

//селективный объект для получения опций:
export const optionsSelector = {
	setOptionsList: function () {
		const sliced = selectorModel.value
			.slice(4)
			.split('')
			.map((w) => w !== ' ' && !isNaN(Number(w)) && Number(w));

		this.frameSize = Number(sliced.slice(0, sliced.indexOf(false)).join(''));
		this.model = selectorModel.value;
		this.ventSystemOptionValue = selectorVentSystem.value === '' ? '-' : selectorVentSystem.value;
		this.brakeType = selectorBrakes.value === '' ? '-' : selectorBrakes.value;
		this.encoderIsChecked = checkboxEncoder.checked;
		this.conicShaftIsChecked = checkboxConicShaft.checked;
		this.pawType =
			selectorPaws.value === '' && motorStandartSetter.selected === '5AI'
				? 'Лапы (1001/1081)'
				: selectorPaws.value === '' && motorStandartSetter.selected === 'ESQ'
				? 'Лапы (B3)'
				: selectorPaws.value;

		//elements temporarily unacceccisble with initial render:
		const checkboxCurrentInsulatingBearing =
			document.getElementById('checkbox-currentInsulatingBearing') === null && this.frameSize >= 200
				? true
				: document.getElementById('checkbox-currentInsulatingBearing') === null && this.frameSize < 200
				? false
				: document.getElementById('checkbox-currentInsulatingBearing').checked;

		const selectorImportBearings =
			document.getElementById('selector-importBearings') === null
				? '-'
				: document.getElementById('selector-importBearings').value;

		const selectorIp = document.getElementById('selector-ip') === null ? 'IP55' : document.getElementById('selector-ip').value;

		optionsConfig.fillBaseOptions(
			this.frameSize,
			this.encoderIsChecked,
			this.ventSystemOptionValue,
			this.brakeType,
			checkboxCurrentInsulatingBearing,
			selectorImportBearings,
			selectorIp
		);

		fillExtraOptions();

		setTransforms(areaSelection.parentElement, '0px', 'Y');
		setTransforms(areaRender, '0px', 'Y');

		const _this = this;
		this.currSelectionToGetImg = {
			e: _this.encoderIsChecked,
			v: _this.ventSystemOptionValue,
			b: _this.brakeType,
		};

		this.currSelectionToGetChartDims = {
			b: _this.brakeType !== '-',
			v: _this.ventSystemOptionValue.includes('Встроенный вентилятор'),
			naezV: _this.ventSystemOptionValue.includes('Пристроенный вентилятор'),
			e: _this.encoderIsChecked,
		};
	},
};

//получение списка опций из полей ввода (селекторы, чекбоксы):
export async function getOptions(selectorsId, operationType) {
	if (selectorModel.value !== '-') {
		optionsSelector.setOptionsList();

		const { electroMagneticBreak, paws, ventSystem } = optionsConfig;

		if (Array.isArray(selectorsId)) {
			if (selectorsId.length > 1) {
				populateOptionsList(selectorsId, [electroMagneticBreak, paws, ventSystem], operationType);
			} else {
				if (selectorsId[0].id === 'selector-breaks') {
					populateOptionsList(selectorsId, [electroMagneticBreak], operationType);
				} else {
					populateOptionsList(selectorsId, [ventSystem], operationType);
				}
			}
		}

		try {
			mask.removeMask();
			const pawTypeAttr = Array.from(selectorPaws.children)
				.find((option) => option.selected === true)
				.getAttribute('data-itemid');

			const ventTypeAttr = Array.from(selectorVentSystem.children)
				.find((option) => option.selected === true)
				.getAttribute('data-itemid');

			const input = input_reverseSelection.value.slice(
				0,
				input_reverseSelection.value.indexOf('-', input_reverseSelection.value.indexOf('/'))
			);

			const modelName =
				motorStandartSetter.selected === '5AI'
					? input
							.split(' ')
							.filter((item) => item.indexOf('/') === -1)
							.join(' ')
					: input;

			const postData = [
				{ type: motorStandartSetter.selected },
				{
					keyword: inputModel.value.length > 0 ? inputModel.value.toUpperCase() : modelName,
				},
				{
					model:
						//filtering out rpm and power for 5ai
						motorStandartSetter.selected === '5AI'
							? optionsSelector.model
									.split(' ')
									.filter((item) => item.indexOf('/') === -1)
									.join(' ')
							: optionsSelector.model,
				},
				{ pawtype: motorStandartSetter.selected === '5AI' ? pawTypeAttr.slice(2) : pawTypeAttr },
				{ with_brakes: optionsSelector.brakeType !== '-' },
				{ with_encoder: optionsSelector.encoderIsChecked },
				{ with_vent: ventTypeAttr !== 'default-vent' },
				{ with_naezd_vent: Number(ventTypeAttr.slice(1)) > 2 },
				{ power: selectorPower.value },
				{ rpm: selectorRpm.value },
				{ framesize: optionsSelector.frameSize },
			];

			const formData = new FormData();

			postData.forEach((obj) => {
				formData.append(Object.keys(obj)[0], Object.values(obj)[0]);
			});

			const url = '/index.php?route=tool/adchr/test/adchr/get_attrs';
			mask.createMask('/image/catalog/adchr/spinner.svg');
			mask.getMaskParams();

			const req = await fetch(url, {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json',
				},
			});

			const res = await req.json();

			setChartConnectionDims(res);
			fillUpgradesChart();
			setModelName();
			mask.removeMask();
		} catch (error) {
			mask.createMask('/image/catalog/adchr/ban.svg');
			mask.getMaskParams();
			console.log(error);
			alert('Smth is broken...');
		}

		//resetting checkboxes:
		checkboxEncoder.disabled = !optionsConfig.encoderIsDisabled;
		checkboxConicShaft.disabled = optionsConfig.conicShaftDisabled;

		const { frameSize, brakeType, encoderIsChecked, ventSystemOptionValue, conicShaftIsChecked, pawType } = optionsSelector;

		setImgSrcData(frameSize, encoderIsChecked, ventSystemOptionValue, conicShaftIsChecked);

		setDrawing(frameSize, brakeType, encoderIsChecked, ventSystemOptionValue, conicShaftIsChecked, pawType);
	}
}

//функция для наполнения списка опций:
export function populateOptionsList(selectorsId, srcData, operationType) {
	selectorsId !== null && selectorsId.forEach((selector, index) => fillOptions(selector, srcData[index]));

	function fillOptions(parentSelector, srcData) {
		//перезаливка опций:
		if (operationType === 'populateOptionsList') {
			Array.from(parentSelector.children).forEach((child) => child.remove());

			srcData.forEach((obj) => {
				const option = document.createElement('option');
				option.value = obj.type;
				option.innerText = obj.type;
				option.disabled = (obj.selectable !== undefined || typeof obj.selectable !== 'undefined') && !obj.selectable;
				option.setAttribute('data-itemId', obj.id);

				parentSelector.appendChild(option);
			});
		}

		//перезаливка свойств disabled:
		if (operationType === 'resetOptionsList') {
			Array.from(parentSelector.children).forEach((child, index) => {
				child.disabled =
					(srcData[index].selectable !== undefined || typeof srcData[index].selectable !== 'undefined') &&
					!srcData[index].selectable;
			});
		}
	}
}

//поиск моделей по текстовому вводу либо по выбору числа оборотов/ мощности:
export async function getModel(query, targetArr) {
	if (query.length > 4 && query.match(regex) !== null && typeof query === 'string') {
		try {
			const formData = new FormData();
			formData.append('type', motorStandartSetter.selected);
			formData.append('keyword', query.toUpperCase());
			const url = '/index.php?route=tool/adchr/test/adchr/get_data_by_input';

			mask.createMask('/image/catalog/adchr/spinner.svg');
			mask.getMaskParams();

			const req = await fetch(url, {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json',
				},
			});

			const res = await req.json();
			console.log(res);

			targetArr = res;
			mask.removeMask();

			if (targetArr.length === 0) {
				mask.createMask('/image/catalog/adchr/ban.svg');
				mask.getMaskParams();
				alert('Модель не найдена, скорректируйте поиск или выберите корректный тип двигателя');
			}
		} catch (error) {
			console.log(error);
			mask.createMask('/image/catalog/adchr/ban.svg');
			mask.getMaskParams();
		}
	} else if (typeof query === 'object' && Array.isArray(query)) {
		try {
			const formData = new FormData();

			const postData = [{ power: String(query[0]) }, { rpm: String(query[1]) }, { type: motorStandartSetter.selected }];
			postData.forEach((data) => formData.append(Object.keys(data)[0], Object.values(data)[0]));

			const url = '/index.php?route=tool/adchr/test/adchr/get_data_by_power_and_rpm_selection';

			mask.createMask('/image/catalog/adchr/spinner.svg');
			mask.getMaskParams();

			const req = await fetch(url, {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json',
				},
			});

			const res = await req.json();
			console.log(res);
			targetArr = res;
			mask.removeMask();
		} catch (error) {
			console.log(error);
			mask.createMask('/image/catalog/adchr/ban.svg');
			mask.getMaskParams();
		}
	}

	Array.from(selectorModel.children).forEach((child, index) => index !== 0 && child.remove());

	//filling models selector with options:
	async function fillModelsOptions(targetObject) {
		const option = document.createElement('option');

		option.value = option.innerText =
			motorStandartSetter.selected === '5AI'
				? `${targetObject.model} ${targetObject.attrs.find((item) => item.attribute_id == 33).text}/${
						targetObject.attrs.find((item) => item.attribute_id == 36).text
				  }`
				: targetObject.model;

		const sliced = targetObject.model
			.slice(4)
			.split('')
			.map((w) => w !== ' ' && !isNaN(Number(w)) && Number(w));

		const frameSize = Number(sliced.slice(0, sliced.indexOf(false)).join(''));
		option.setAttribute('data-itemId', frameSize);
		selectorModel.appendChild(option);
	}

	//if received json is array:
	if (typeof targetArr === 'object' && Array.isArray(targetArr)) {
		targetArr.forEach((obj) => {
			fillModelsOptions(obj);
		});
	}
	//else if received json is a single object:
	else {
		const targetObj = targetArr;
		fillModelsOptions(targetObj);
	}

	//автопроставление модели и опций для нее при поиске, если модель найдена и опция подружена в селект:
	if (selectorModel.children[1] !== undefined && typeof selectorModel.children[1] !== undefined) {
		mask.removeMask();

		selectorModel.children[1].selected = true;
		await getOptions([selectorBrakes, selectorPaws, selectorVentSystem], 'populateOptionsList');

		//перезаливка наименования:
		setModelName();

		//выставление IP55 по умолчанию при поиске новой модели:
		document.getElementById('selector-ip').children[0].selected = true;

		//перезаливка описательной части для IP при поиске новой модели (всегда по умолчанию выставляется IP55 из опции 1):
		setModelDescription(
			'addData',
			Array.from(document.getElementById('selector-ip').children)
				.find((option) => option.selected)
				.getAttribute('data-itemid')
		);

		//выставление УХЛ:
		setModelDescription(
			'addData',
			Array.from(document.getElementById('selector-climateCat').children)
				.find((option) => option.selected)
				.getAttribute('data-itemid')
		);

		//перезаливка описательной части для импортных подшипников:
		setModelDescription(
			'addData',
			Array.from(document.getElementById('selector-importBearings').children)
				.find((option) => option.selected)
				.getAttribute('data-itemid')
		);

		//перезаливка и перевыставление атр. checked и disabled для токоизю подшипника и импортных подшипников:
		const checkboxCurrentInsulatingBearing = document.getElementById('checkbox-currentInsulatingBearing');
		const selectorImportBearings = document.getElementById('selector-importBearings');

		if (
			Array.from(checkboxCurrentInsulatingBearing.classList).some((className) => className.includes('-checked')) &&
			optionsSelector.frameSize < 200
		) {
			checkboxCurrentInsulatingBearing.checked = false;

			checkboxCurrentInsulatingBearing.classList.replace(
				'checkbox-currentInsulatingBearing-checked',
				'checkbox-currentInsulatingBearing-unchecked'
			);

			Array.from(selectorImportBearings.children).forEach((child) => {
				child.disabled = false;
			});
		} else if (
			Array.from(checkboxCurrentInsulatingBearing.classList).some((className) => className.includes('-unchecked')) &&
			optionsSelector.frameSize >= 200
		) {
			if (selectorImportBearings.value === 'Передний и задний шариковые подшипники (производства SKF/NSK/KOYO/FAG)') {
				checkboxCurrentInsulatingBearing.checked = false;
				selectorImportBearings.children[1].disabled = true;
			} else {
				checkboxCurrentInsulatingBearing.checked = true;
				checkboxCurrentInsulatingBearing.classList.replace(
					'checkbox-currentInsulatingBearing-unchecked',
					'checkbox-currentInsulatingBearing-checked'
				);
				selectorImportBearings.children[1].disabled = false;
				selectorImportBearings.children[2].disabled = true;
			}
		}

		//вывод предупреждения при отсутствии выбора токоиз. подшипника для двигателей >= 200 габ.:
		showWarning();

		//вывод описания для токоиз. подшипника автоматически при выборе модели >= 200 габ.:
		if (
			Array.from(checkboxCurrentInsulatingBearing.classList).some((className) => className.includes('-checked')) &&
			optionsSelector.frameSize >= 200
		) {
			setModelDescription('addData', 'checkbox-currentInsulatingBearing');
		}
	} else {
		//маска для поля выбора, чтобы пользователь не мог им воспользоваться, пока не скорректирует поиск:
		mask.createMask('/image/catalog/adchr/ban.svg');
		mask.getMaskParams();
	}

	if (
		(typeof query === 'string' && query.length < 4 && !query.match(regex)) ||
		(typeof query === 'object' && Array.isArray(query) && query.some((param) => param === '-'))
	) {
		Array.from(selectorModel.children).forEach((child, index) => index !== 0 && child.remove());
	}
}

//выбор чертежа в зависимости от ввода (селекторы / чекбоксы):
function setDrawing(frameSize, brakeType, encoderIsChecked, ventSystemOptionValue, conicShaftIsChecked, pawType) {
	const pathStart =
		brakeType !== '-' || encoderIsChecked || ventSystemOptionValue !== '-' || conicShaftIsChecked
			? 'https://www.elcomspb.ru/image/catalog/products/to/engine/adchr/'
			: 'https://www.elcomspb.ru/image/catalog/products/to/engine/'.concat(
					motorStandartSetter.selected === 'ESQ' ? 'din/' : '5ai/new/'
			  );

	const path_vent_part =
		ventSystemOptionValue.includes('наездник') && frameSize >= 112 && frameSize <= 132
			? 'naezd/do_132/'
			: ventSystemOptionValue.includes('наездник') && frameSize > 132 && frameSize <= 250
			? 'naezd/160_250/'
			: ventSystemOptionValue.includes('наездник') && frameSize > 250
			? 'naezd/ot_280/'
			: '';

	const path_shaft_part = conicShaftIsChecked === true ? 'shaft/' : '';
	let restPath = '';
	let completePath = '';

	switch (pawType) {
		case 'Лапы (1001/1081)':
		case 'Лапы (B3)':
			restPath =
				brakeType !== '-' || encoderIsChecked || ventSystemOptionValue !== '-' || conicShaftIsChecked
					? path_vent_part + path_shaft_part + 'paws/'
					: motorStandartSetter.selected === 'ESQ'
					? 'imb3.png'
					: '1001_small.png';
			break;

		//!!&& !ventSystemOptionValue.includes('наездник') - временное решение, пока нет чертежей для наездника ESQ
		case 'Лапы + Фланец (2001/2081)':
		case 'Лапы + Фланец (B35)':
			if (brakeType !== '-' || encoderIsChecked || ventSystemOptionValue !== '-' || conicShaftIsChecked) {
				restPath =
					path_vent_part +
					path_shaft_part.concat(
						motorStandartSetter.selected === 'ESQ' && !ventSystemOptionValue.includes('наездник')
							? 'din/large_flange_paws/'
							: 'large_flange_paws/'
					);
			} else {
				restPath =
					motorStandartSetter.selected === '5AI' && frameSize <= 180
						? '2001_below_small.png'
						: motorStandartSetter.selected === '5AI' && frameSize > 180
						? '2001_over_small.png'
						: motorStandartSetter.selected === 'ESQ' && frameSize < 225
						? 'imb35.png'
						: 'imb35_over225.png';
			}
			break;

		//!!&& !ventSystemOptionValue.includes('наездник') - временное решение, пока нет чертежей для наездника ESQ
		case 'Фланец (3081)':
		case 'Лапы (B5)':
			if (brakeType !== '-' || encoderIsChecked || ventSystemOptionValue !== '-' || conicShaftIsChecked) {
				restPath =
					path_vent_part +
					path_shaft_part.concat(
						motorStandartSetter.selected === 'ESQ' && !ventSystemOptionValue.includes('наездник')
							? 'din/flange/'
							: 'flange/'
					);
			} else {
				restPath =
					motorStandartSetter.selected === '5AI' && frameSize <= 132
						? '3001_below_small.png'
						: motorStandartSetter.selected === '5AI' && frameSize > 132
						? '3001_over.png'
						: motorStandartSetter.selected === 'ESQ' && frameSize < 225
						? 'imb5.png'
						: 'imb5_over225.png';
			}

			break;

		case 'Лапы + Малый фланец (2181)':
		case 'Лапы + Мал. фланец (B34)':
			if (brakeType !== '-' || encoderIsChecked || ventSystemOptionValue !== '-' || conicShaftIsChecked) {
				restPath = path_vent_part + path_shaft_part + 'little_flange_paws/';
			} else {
				restPath = motorStandartSetter.selected === '5AI' ? '2101_small.png' : 'imb34.png';
			}
			break;

		case 'Мал. фланец (B14)':
			restPath =
				brakeType !== '-' || encoderIsChecked || ventSystemOptionValue !== '-' || conicShaftIsChecked
					? path_vent_part + path_shaft_part + 'little_flange/'
					: 'imb14.png';
	}

	const currSelectionIndex = optionsConfig.options.findIndex(
		(optionObj) => JSON.stringify(optionObj) === JSON.stringify(optionsSelector.currSelectionToGetImg)
	);

	completePath = `${pathStart}${restPath}${imgSrcData.data[currSelectionIndex].path}`;

	imageDrawing.setAttribute('src', completePath);
}

export function setChartConnectionDims(dataChart) {
	//first checking if returned data is object:
	if (typeof dataChart === 'object' && !Array.isArray(dataChart)) {
		const data = Object.entries(dataChart)
			.filter((entry) => entry[1] !== '')
			.map((k) => {
				return { [k[0]]: k[1] };
			});

		fillChart(chart_connectionParams, data);

		//fill in chart data:
		function fillChart(html_parent, srcObj) {
			while (html_parent.firstElementChild) {
				html_parent.removeChild(html_parent.firstElementChild);
			}

			const chart = document.createElement('table');
			chart.id = 'table_connectionParams';

			chart.innerHTML = `
			<tr>
			${srcObj.map((param) => `<th> ${Object.keys(param)[0]} </th>`).join('')}
			</tr>
			<tr>
			${srcObj.map((param) => `<td> ${Object.values(param)[0]} </td>`).join('')}
			</tr>
			`;

			html_parent.appendChild(chart);
		}
	}
}

//формирование наименования описательной части к чертежу:
export function setModelDescription(operationType, htmlElemRef) {
	if (operationType === 'addData') {
		addDescription(htmlElemRef);
	}

	if (operationType === 'removeData') {
		removeDescription(htmlElemRef);
	}

	function addDescription(htmlElemRef) {
		if (htmlElemRef.includes('Б1') || htmlElemRef.includes('Б3') || htmlElemRef.includes('Б5')) {
			createListItem('wiring-sensors-description', htmlElemRef);
		}

		if (htmlElemRef.includes('Б2') || htmlElemRef.includes('Б4') || htmlElemRef.includes('Б6')) {
			createListItem('bearing-sensors-description', htmlElemRef);
		}

		if (htmlElemRef.includes('checkbox-conicShaft')) {
			createListItem('conicShaft', htmlElemRef);
		}

		if (htmlElemRef.includes('checkbox-vibrosensors')) {
			createListItem('vibroSensors', htmlElemRef);
		}

		if (htmlElemRef.includes('checkbox-antiCondenseHeater')) {
			createListItem('antiCondensingHeater', htmlElemRef);
		}

		if (htmlElemRef.includes('checkbox-currentInsulatingBearing')) {
			createListItem('currentInsulatingBearing', htmlElemRef);
		}

		if ((htmlElemRef.includes('S1') && !htmlElemRef.includes('S12')) || htmlElemRef.includes('S12')) {
			createListItem('importBearings', htmlElemRef);
		}

		if (htmlElemRef.includes('V1') || htmlElemRef.includes('V2') || htmlElemRef.includes('V3') || htmlElemRef.includes('V4')) {
			createListItem('ventSystem', htmlElemRef);
		}

		if (
			htmlElemRef.includes('ED') ||
			htmlElemRef.includes('ET') ||
			htmlElemRef.includes('ED1') ||
			htmlElemRef.includes('ET1') ||
			htmlElemRef.includes('ED2') ||
			htmlElemRef.includes('ET2') ||
			htmlElemRef.includes('ED1ED2') ||
			htmlElemRef.includes('ET1ET2')
		) {
			createListItem('electroMagneticBreak', htmlElemRef);
		}

		if (
			htmlElemRef.includes('IP55') ||
			htmlElemRef.includes('IP54') ||
			htmlElemRef.includes('IP65') ||
			htmlElemRef.includes('IP66')
		) {
			createListItem('ipVersion', htmlElemRef);
		}

		if (htmlElemRef.includes('У2') || htmlElemRef.includes('У1') || htmlElemRef.includes('УХЛ2') || htmlElemRef.includes('УХЛ1')) {
			createListItem('climateCat', htmlElemRef);
		}
	}

	function removeDescription(htmlElemRef) {
		const list = areaRender.lastElementChild;

		function clearDesc(listItem_classname) {
			if (document.querySelector('.' + listItem_classname) !== null) {
				document.querySelector('.' + listItem_classname).innerHTML = '';
				Array.from(list.children).forEach((child) => child.className.includes(listItem_classname) && child.remove());
			}
		}
		if (htmlElemRef.includes('Б1') || htmlElemRef.includes('Б3') || htmlElemRef.includes('Б5')) {
			clearDesc('wiring-sensors-description');
		}

		if (htmlElemRef.includes('Б2') || htmlElemRef.includes('Б4') || htmlElemRef.includes('Б6')) {
			clearDesc('bearing-sensors-description');
		}

		if (htmlElemRef.includes('checkbox-conicShaft')) {
			clearDesc('conicShaft');
		}

		if (htmlElemRef.includes('checkbox-vibrosensors')) {
			clearDesc('vibroSensors');
		}

		if (htmlElemRef.includes('checkbox-antiCondenseHeater')) {
			clearDesc('antiCondensingHeater');
		}

		if (htmlElemRef.includes('checkbox-currentInsulatingBearing')) {
			clearDesc('currentInsulatingBearing');
		}

		if (htmlElemRef.includes('default-imp')) {
			clearDesc('importBearings');
		}

		if (htmlElemRef.includes('default-vent')) {
			clearDesc('ventSystem');
		}

		if (htmlElemRef.includes('default-brakes')) {
			clearDesc('electroMagneticBreak');
		}
	}

	function createListItem(optionsConfigPropName, htmlElemRef) {
		const propName =
			optionsConfigPropName.includes('wiring') || optionsConfigPropName.includes('bearing')
				? 'tempDataSensors'
				: optionsConfigPropName;

		const text = Array.isArray(optionsConfig[propName])
			? optionsConfig[propName].find((data) => data.id === htmlElemRef).description
			: optionsConfig[propName].description;

		const list = areaRender.lastElementChild;

		Array.from(list.children).forEach((child) => child.className.includes(optionsConfigPropName) && child.remove());

		const listItem = document.createElement('li');
		listItem.className = optionsConfigPropName;
		listItem.innerHTML = text;

		list.insertBefore(listItem, listItemUpgrades);
	}
}
//наполнение секции доп. доработок в случае выбора энкодера и/ или системы вентиляции и/ или тормозов:
export function fillUpgradesChart() {
	const { frameSize, brakeType, encoderIsChecked, ventSystemOptionValue } = optionsSelector;
	const { upgradesData, electroMagneticBreak, ventSystem } = optionsConfig;

	const upgradeObj = upgradesData.find((upg) => upg.id === frameSize);
	const { brakeMoment, brake_consumedPower, reactionTime, vent_consumedPower, vent_consumedCurrent } = upgradeObj;

	if (brakeType !== '-') {
		setCol(
			'addCol',
			'list-brakeupgrades',
			'Электромагнитный тормоз',
			electroMagneticBreak,
			brakeType,
			[brakeMoment, brake_consumedPower, reactionTime],
			'Потребляемая мощность'
		);
	} else {
		setCol('removeCol', 'list-brakeupgrades');
	}

	if (ventSystemOptionValue !== '-') {
		setCol(
			'addCol',
			'list-ventupgrades',
			'Независимая вентиляция',
			ventSystem,
			ventSystemOptionValue,
			[vent_consumedPower, vent_consumedCurrent],
			'Напряжение питания'
		);

		document.getElementById('selector-ip').value === 'IP54' && frameSize >= 90
			? document
					.querySelector('.list-ventupgrades')
					.insertAdjacentHTML('afterbegin', `<span class="warning"> Доступна доработка до степени защиты IP55 </span>`)
			: Array.from(document.querySelector('.list-ventupgrades').children).forEach(
					(child) => child.className.includes('warning') && child.remove
			  );
	} else {
		setCol('removeCol', 'list-ventupgrades');
	}

	if (encoderIsChecked) {
		const encoderConfig = {
			signalsStaticValue: { description: 'Выходные сигналы', data: 'А+, В+, R+, А-, В-, R-' },
			voltageParam: { description: 'Напряжение питания, В', data: document.getElementById('selector-encoderVoltage').value },
			signalParam: { description: 'Тип выхода', data: document.getElementById('selector-outputSignal').value },
			resolutionParam: {
				description: 'Разрешение, имп/об.',
				data: document.getElementById('input-encoderResOptions').value,
			},
		};

		const encoderData = Object.values(encoderConfig).map((object) => object);
		setCol('addCol', 'list-encoderOptions', 'Энкодер', null, null, encoderData, null);
	} else {
		setCol('removeCol', 'list-encoderOptions');
	}

	function setCol(operationType, listId, colName, optionsConfigPropToFindValue, valueToSearch, upgradeObjData, textForPower) {
		if (operationType === 'addCol') {
			Array.from(listItemUpgrades.children).forEach(
				(ul) => Array.from(ul.classList).some((classname) => classname.includes(listId)) && ul.remove()
			);

			const list = document.createElement('ul');
			list.classList.add('list', listId);

			const power =
				optionsConfigPropToFindValue !== null &&
				optionsConfigPropToFindValue.find((opt) => opt.type === valueToSearch).power;

			const upgradesList = upgradeObjData;

			Array.from(list.children).forEach((child) => child.remove());

			list.insertAdjacentHTML('afterbegin', `<li> <span style="font-weight: 900;"> ${colName} </span> </li>`);

			upgradesList.forEach((upg) => {
				const listItem = document.createElement('li');
				listItem.innerHTML = `${upg.description}: ${upg.data}`;

				list.appendChild(listItem);
			});

			if (optionsConfigPropToFindValue !== null) {
				const listItem = document.createElement('li');
				listItem.innerHTML = `${textForPower}: ${power}кВт`;

				list.appendChild(listItem);
			}

			listItemUpgrades.appendChild(list);
		} else {
			Array.from(listItemUpgrades.children).forEach(
				(ul) => Array.from(ul.classList).some((classname) => classname.includes(listId)) && ul.remove()
			);
		}
	}
}

//формирование наименования двигателя:
export function setModelName() {
	setTimeout(() => {
		const { model, ventSystemOptionValue, brakeType, encoderIsChecked, conicShaftIsChecked } = optionsSelector;
		//формируем наименование при выборе опций:
		let name = model;

		//код для датчиков обмотки и подшипников:
		const temp_arr_ws = Array.from(document.getElementById('list-windingSensors').children);
		const temp_arr_bs = Array.from(document.getElementById('list-bearingSensors').children);

		const wiringSensorsCode = temp_arr_ws.some((child) => !child.firstElementChild.getAttribute('class').includes('non-selected'))
			? '-' +
			  temp_arr_ws
					.find((child) => !child.firstElementChild.getAttribute('class').includes('non-selected'))
					.firstElementChild.getAttribute('class')
					.split(' ')[1]
			: '';

		const bearingSensorsCode = temp_arr_bs.some((child) => !child.firstElementChild.getAttribute('class').includes('non-selected'))
			? '-' +
			  temp_arr_bs
					.find((child) => !child.firstElementChild.getAttribute('class').includes('non-selected'))
					.firstElementChild.getAttribute('class')
					.split(' ')[1]
			: '';

		const ws_bs_code = (wiringSensorsCode + bearingSensorsCode)
			.split('')
			.filter((letter, index, exp) => letter.match(regex) && index === exp.indexOf(letter))
			.join('');

		name += ws_bs_code;

		//код для выбродатчиков:
		document.getElementById('checkbox-vibrosensors').checked ? (name += '-' + 'W1') : null;

		//код для антиконденсатного подогрева:
		document.getElementById('checkbox-antiCondenseHeater').checked ? (name += '-' + 'H') : null;

		//код для токоиз. подшипника:
		document.getElementById('checkbox-currentInsulatingBearing').checked ? (name += '-' + 'F2') : null;

		//код для импортных подшипников:
		document.getElementById('selector-importBearings').value !== '-' &&
			updateModelNameForSelect(document.getElementById('selector-importBearings'));

		//код для тормоза:
		brakeType !== '-' ? updateModelNameForSelect(selectorBrakes) : null;

		//код для вентиляции:
		ventSystemOptionValue !== '-' ? updateModelNameForSelect(selectorVentSystem) : null;

		//код для энкодера и опций:
		encoderIsChecked ? (name += '-' + 'N') : null;

		//разрешение:
		const e_res = document.getElementById('input-encoderResOptions');
		e_res !== null && e_res.value.match(regex) ? (name += e_res.value) : null;

		//напряжение:
		const e_volt = document.getElementById('selector-encoderVoltage');
		e_volt !== null && e_volt.value !== '-' ? updateModelNameForSelect(e_volt) : null;

		//выходной сигнал:
		const e_signal = document.getElementById('selector-outputSignal');
		e_signal !== null && e_signal.value !== '-' ? updateModelNameForSelect(e_signal) : null;

		//код для IP:
		document.getElementById('selector-ip').value !== '-' ? updateModelNameForSelect(document.getElementById('selector-ip')) : null;

		//код для УХЛ:
		document.getElementById('selector-climateCat').value !== '-'
			? updateModelNameForSelect(document.getElementById('selector-climateCat'))
			: null;

		//код для исполнения:
		updateModelNameForSelect(selectorPaws);

		//код при выборе конусного вала:
		const finalName = conicShaftIsChecked ? name.slice(0, name.length - 1) + '3' : name;
		h2ModelName.innerText = finalName;

		//обновление наименования при выборе опций селекторов:
		function updateModelNameForSelect(parentSelector) {
			name += !Array.from(parentSelector.children).some((child) => child.selected && child.innerText === '-')
				? '-' +
				  Array.from(parentSelector.children)
						.find((child) => child.selected === true)
						.getAttribute('data-itemid')
				: '';
		}
	}, 10);
}

//обратный вывод опций от инпута:
export async function selectOptionsReversevely(e) {
	try {
		//mask.removeMask();
		const areaSelection_subchilds = Array.from(areaSelection.children)
			.slice(1)
			.map((child) =>
				child.firstElementChild.tagName === 'UL'
					? Array.from(child.firstElementChild.children)
							.reduce((acc, curr) => [...acc, curr.firstElementChild], [])
							.concat(
								Array.from(child.firstElementChild.nextElementSibling.children).reduce(
									(acc, curr) => [...acc, curr.firstElementChild],
									[]
								)
							)
					: Array.from(child.children)
			)
			.flat(1)
			.filter((subchild) => subchild.tagName !== 'LABEL');

		//	console.log(areaSelection_subchilds);

		const elements = [];
		areaSelection_subchilds.forEach((sub) => recurse(sub));

		//console.log(elements);

		function recurse(elem) {
			if (elem.firstElementChild === null) {
				elements.push(elem);

				if (elem.nextElementSibling === null) {
					return;
				} else {
					recurse(elem.nextElementSibling);
				}
			} else {
				recurse(elem.firstElementChild);
			}
		}

		const arr_valueToDecode = input_reverseSelection.value
			.split('/')[1]
			.split('-')
			.slice(1)
			.map((val) =>
				//handling case for sensors: val.length > 1 means 2 digits, like Б12, Б24 etc:
				val[0] === 'Б'.toUpperCase() && val.length > 1
					? val
							.slice(1)
							.split('')
							.reduce((acc, curr) => [...acc, 'Б' + curr], [])
					: val
			)
			.flat(1);

		elements.forEach((element) => {
			const foundIndex = arr_valueToDecode.findIndex((val) =>
				//special case for encoder:
				val.includes('N'.toUpperCase())
					? element.getAttribute('data-itemid') === val.slice(0, 1)
					: //and for the rest:
					  element.getAttribute('data-itemid') === String(val)
			);

			switch (element.tagName) {
				case 'OPTION':
					element.selected = foundIndex !== -1 ? true : false;
					element.selected && setModelDescription('addData', element.getAttribute('data-itemid'));

					element.value === '-' &&
						setModelDescription(
							'removeData',
							Array.from(element.parentElement.children)
								.find((child) => child.value === '-')
								.getAttribute('data-itemid')
						);

					break;

				case 'INPUT':
					element.checked =
						(element.getAttribute('type') === 'checkbox' && foundIndex !== -1) ||
						//separate case for conic shaft:
						(element.id === 'checkbox-conicShaft' &&
							//exclusion for B3 ESQ type
							input_reverseSelection.value[input_reverseSelection.value.length - 2] !== 'B' &&
							input_reverseSelection.value[input_reverseSelection.value.length - 1] == 3)
							? true
							: false;

					//resetting pawtype option comparing to decoder input and regardless of last digit:
					if (element.id === 'checkbox-conicShaft' && element.checked) {
						Array.from(selectorPaws.children).find(
							(option) =>
								option.getAttribute('data-itemid').slice(0, 5) ==
								arr_valueToDecode[arr_valueToDecode.length - 1].slice(0, 5)
						).selected = true;
					}

					element.checked ? setModelDescription('addData', element.id) : setModelDescription('removeData', element.id);

					//for elems unavailable with init render:
					if (element.checked && element.id === 'checkbox-encoder') {
						//returns value to input-encoderResOptions if there was any:
						const temp = arr_valueToDecode.filter((val) => val[0].toUpperCase() === 'N')[0].slice(1);

						if (document.getElementById('encoder-group-id0') === null) {
							setTimeout(() => {
								selectOptionsReversevely(e);
							}, 10);
						} else {
							document.getElementById('input-encoderResOptions').value = temp;
						}
					}

					break;

				case 'BUTTON':
					foundIndex !== -1
						? element.classList.replace('btn-option-non-selected', 'btn-option-selected')
						: element.classList.replace('btn-option-selected', 'btn-option-non-selected');

					element.classList.contains('btn-option-non-selected') &&
						setModelDescription('removeData', element.getAttribute('data-itemid'));

					setTimeout(() => {
						!element.classList.contains('btn-option-non-selected') &&
							setModelDescription('addData', element.getAttribute('data-itemid'));
					}, 10);

					break;
			}
		});

		e.target.disabled = true;
		await getOptions([selectorBrakes, selectorPaws, selectorVentSystem], 'resetOptionsList');
		e.target.disabled = false;
	} catch (err) {
		mask.createMask('/image/catalog/adchr/ban.svg');
		mask.getMaskParams();
		e.target.disabled = false;
		alert('Введено что-то не то');
		console.log(err);
	}
}
