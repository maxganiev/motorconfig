import { areaSelection } from './global_dom';
export const regex = /^(?!\s*$).+/;
export const motorStandartSetter = {
	//5ai by default when page first uploaded:
	selected: localStorage.getItem('standard-selected') === null ? '5AI' : localStorage.getItem('standard-selected'),
	setMotorStandart: function (btnId) {
		this.selected = btnId === 'btn-5ai-select' ? '5AI' : 'ESQ';
	},
};
export const areaSelection_childs_num_on_init_render = areaSelection.children.length;
