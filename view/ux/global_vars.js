export const regex = /^(?!\s*$).+/;
export const motorStandartSetter = {
	//5ai by default when page first uploaded:
	selected: localStorage.getItem('standard-selected') === null ? '5AI' : localStorage.getItem('standard-selected'),
	setMotorStandart: function (btnId) {
		this.selected = btnId === 'btn-5ai-select' ? '5AI' : 'ESQ';
	},
};
