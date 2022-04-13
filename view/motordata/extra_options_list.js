import { areaSelection, checkboxConicShaft, selectorBrakes } from '../ux/global_dom';
import { optionsConfig } from './base_options_list';
import { populateOptionsList, optionsSelector } from '../ux/selectFunctions';
import { recalculateHeight } from '../ui/ui';
import { areaSelection_childs_num_on_init_render } from '../ux/global_vars';

//заливка доступного для габарита опционала при выборе модели двигателя:
export function fillExtraOptions() {
	const { tempDataSensors, vibroSensors, antiCondensingHeater, currentInsulatingBearing, importBearings, climateCat, ipVersion } =
		optionsConfig;

	//проверяем были ли уже отрендерены элементы для остальных опций, которые не было жестко вбиты в исходный хмтл; если нет - добавляем их:
	if (areaSelection.children.length <= areaSelection_childs_num_on_init_render) {
		//заливка кнопок для выбора датчиков температуры:
		const listItem = document.createElement('li');
		const column_WindingSensors = document.createElement('ul');
		const column_BearingSensors = document.createElement('ul');

		column_WindingSensors.id = 'list-windingSensors';
		column_BearingSensors.id = 'list-bearingSensors';

		tempDataSensors.forEach((obj, index) => {
			const listItem = document.createElement('li');

			const btn = document.createElement('button');
			btn.classList.add('btn', 'btn-sm', 'btn-option-non-selected');
			btn.id = `btn-options-sensors-id${index}`;
			btn.classList.add(obj.id);
			btn.setAttribute('data-itemId', obj.id);
			btn.disabled = !obj.selectable;
			btn.innerHTML = obj.type;

			obj.group === 'Датчики температуры обмотки'
				? column_WindingSensors.appendChild(listItem)
				: column_BearingSensors.appendChild(listItem);
			listItem.appendChild(btn);

			//описание подгруппы датчиков (текст вставляем только раз для каждой подгруппы, поэтому использую индексы):
			index === 0 && column_WindingSensors.insertAdjacentText('afterbegin', obj.group);
			index === 3 && column_BearingSensors.insertAdjacentText('afterbegin', obj.group);
		});

		listItem.appendChild(column_WindingSensors);
		listItem.appendChild(column_BearingSensors);

		listItem.classList.add('flex-row');
		areaSelection.insertAdjacentElement('afterbegin', listItem);

		//чекбокс для выбора вибродатчиков:
		createCheckBoxes(areaSelection, 'checkbox-vibrosensors', vibroSensors.id, !vibroSensors.selectable, vibroSensors.type, null);

		//чекбокс для выбора антиконденсатного подогрева:
		createCheckBoxes(
			areaSelection,
			'checkbox-antiCondenseHeater',
			antiCondensingHeater.id,
			!antiCondensingHeater.selectable,
			antiCondensingHeater.type,
			null
		);

		//чекбокс для выбора токоизолированного подшипника:
		createCheckBoxes(
			areaSelection,
			'checkbox-currentInsulatingBearing',
			currentInsulatingBearing.id,
			!currentInsulatingBearing.selectable,
			currentInsulatingBearing.type,
			currentInsulatingBearing.checked
		);

		//селект для выбора импортных подшипников:
		createSelects(areaSelection, 'selector-importBearings', importBearings);

		//выбор климатического исполнения:
		createSelects(areaSelection, 'selector-climateCat', climateCat);

		//выбор IP:
		createSelects(areaSelection, 'selector-ip', ipVersion);

		//статический чекбокс для выбора упаковки:
		createCheckBoxes(areaSelection, 'checkbox-package', 'pkg', false, 'Дополнительная упаковка оборудования', false);
	}
	//если да - берем уже существующие и перезаливаем необходимые значения:
	else {
		document.getElementById('checkbox-vibrosensors').disabled = !vibroSensors.selectable;
		document.getElementById('checkbox-antiCondenseHeater').disabled = !antiCondensingHeater.selectable;

		const checkboxCurrentInsulatingBearing = document.getElementById('checkbox-currentInsulatingBearing');
		checkboxCurrentInsulatingBearing.disabled = !currentInsulatingBearing.selectable;

		populateOptionsList([document.getElementById('selector-importBearings')], [importBearings], 'resetOptionsList');
		populateOptionsList([document.getElementById('selector-ip')], [ipVersion], 'resetOptionsList');

		//вывод предупреждения при отсутствии выбора токоиз. подшипника для двигателей >= 200 габ.:
		showWarning();

		Array.from(document.getElementById('list-windingSensors').children).forEach(
			(child, index) => (child.firstElementChild.disabled = !tempDataSensors.slice(0, 3)[index].selectable)
		);
		Array.from(document.getElementById('list-bearingSensors').children).forEach(
			(child, index) => (child.firstElementChild.disabled = !tempDataSensors.slice(3)[index].selectable)
		);

		//добавление опций для энкодера:
		//если энкодер выбран:
		if (optionsSelector.encoderIsChecked) {
			//проверяем, не было ли рендера для доп опций энкодера; если нет - заливаем:
			if (Array.from(areaSelection.children).every((child) => !child.id.includes('encoder-group-id'))) {
				Object.values(optionsConfig.encoderParams).forEach((value, index) => {
					const listItem = document.createElement('li');
					listItem.id = `encoder-group-id${index}`;

					//св-во encoderParams состоит из одного объекта и 2 массивов объектов; проверяем, откуда берутся данные, и заливаем соот-но:
					if (!Array.isArray(value)) {
						const inputEncoderRes = document.createElement('input');
						inputEncoderRes.id = 'input-encoderResOptions';
						inputEncoderRes.setAttribute('type', 'number');
						inputEncoderRes.classList.add('form-control');

						const label = document.createElement('label');
						label.innerHTML = value.type;
						label.htmlFor = 'input-encoderResOptions';

						listItem.insertAdjacentElement('afterbegin', label);
						listItem.appendChild(inputEncoderRes);
					} else {
						if (index === 1) {
							createSelects(listItem, 'selector-encoderVoltage', value);
						}

						if (index === 2) {
							createSelects(listItem, 'selector-outputSignal', value);
						}
					}

					areaSelection.insertBefore(listItem, checkboxConicShaft.parentElement);
					recalculateHeight(areaSelection);
				});
			}
		} //если нет - стираем существующие опции для энкодера:
		else {
			Array.from(areaSelection.children).forEach((child) => child.id.includes('encoder-group-id') && child.remove());
			recalculateHeight(areaSelection);
		}
	}
}

//func to create checkboxes:
function createCheckBoxes(parentElem, checkboxId, dataAttr, checkboxIsSelectable, checkboxLabelInnerHtml, checkboxIsCheckedByDefault) {
	const listItem = document.createElement('li');

	const checkbox = document.createElement('input');
	const attrs = [{ type: 'checkbox' }, { 'data-itemid': dataAttr }, { role: 'switch' }];
	attrs.forEach((attr) => checkbox.setAttribute(Object.keys(attr)[0], Object.values(attr)[0]));
	checkbox.classList.add('form-check-input');
	checkbox.id = checkboxId;
	checkbox.disabled = checkboxIsSelectable;
	checkbox.checked = checkboxIsCheckedByDefault !== null && checkboxIsCheckedByDefault;

	const label = document.createElement('label');
	label.htmlFor = checkboxId;
	label.innerHTML = checkboxLabelInnerHtml;

	listItem.appendChild(label);
	listItem.appendChild(checkbox);
	listItem.classList.add('form-check', 'form-switch');

	parentElem.appendChild(listItem);

	if (checkbox.checked) {
		checkbox.classList.add(`${checkboxId}-checked`);
	} else {
		checkbox.classList.add(`${checkboxId}-unchecked`);
	}
}

//func to create selects for baseOptions function:
function createSelects(parentElem, selectId, srcDataToFillOptions) {
	const listItem =
		selectId !== 'selector-encoderVoltage' && selectId !== 'selector-outputSignal' ? document.createElement('li') : parentElem;
	const selector = document.createElement('select');
	selector.id = selectId;
	selector.classList.add('form-control', 'form-control-sm');

	const label = document.createElement('label');
	label.htmlFor = selectId;
	label.innerHTML = srcDataToFillOptions[0].group;

	listItem.insertAdjacentElement('afterbegin', label);
	listItem.appendChild(selector);

	populateOptionsList([selector], [srcDataToFillOptions], 'populateOptionsList');

	selectId !== 'selector-encoderVoltage' &&
		selectId !== 'selector-outputSignal' &&
		parentElem.insertBefore(listItem, selectorBrakes.parentElement);
}

//вывод предупреждения при отсутствии выбора токоиз. подшипника для двигателей >= 200 габ.:
export function showWarning() {
	const checkboxCurrentInsulatingBearing = document.getElementById('checkbox-currentInsulatingBearing');
	const selectorImportBearings = document.getElementById('selector-importBearings');

	if (
		optionsSelector.frameSize >= 200 &&
		!checkboxCurrentInsulatingBearing.checked &&
		selectorImportBearings.value !== 'Передний и задний шариковые подшипники (производства SKF/NSK/KOYO/FAG)'
	) {
		Array.from(checkboxCurrentInsulatingBearing.parentElement.childNodes).forEach((node, index) => index === 2 && node.remove());
		checkboxCurrentInsulatingBearing.parentElement.insertAdjacentHTML(
			'beforeend',
			`<p class="warning"> ${optionsConfig.currentInsulatingBearing.warning} </p>`
		);
	} else {
		Array.from(checkboxCurrentInsulatingBearing.parentElement.childNodes).forEach((node, index) => index === 2 && node.remove());
	}
}
