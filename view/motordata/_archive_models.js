//сырые входные данные:
const motorData = [
	{
		standard: '5АИ',
		techData: {
			frameSize: 50,
			series: ['MA2', 'MA4', 'MB2', 'MB4'],
			power: [0.09, 0.06, 0.12, 0.09],
			voltage: '220/380',
			rpm: [3000, 1500, 3000, 1500],
		},
	},

	{
		standard: '5АИ',
		techData: {
			frameSize: 63,
			series: ['A2', 'A4', 'A6', 'B2', 'B4', 'B6'],
			power: [0.37, 0.25, 0.18, 0.55, 0.37, 0.25],
			voltage: '220/380',
			rpm: [3000, 1500, 1000, 3000, 1500, 1000],
		},
	},

	{
		standard: '5АИ',
		techData: {
			frameSize: 200,
			series: ['M2', 'M4', 'M6', 'M8', 'L2', 'L4', 'L6', 'L8'],
			power: [37, 37, 22, 18.5, 45, 45, 30, 22],
			voltage: '380/660',
			rpm: [3000, 1500, 1000, 750, 3000, 1500, 1000, 750],
		},
	},

	{
		standard: 'ESQ',
		techData: {
			frameSize: 63,
			series: ['A2-SDN', 'A4-SDN', 'A6-SDN', 'B2-SDN', 'B4-SDN', 'B6-SDN', 'D4-SDN'],
			power: [0.18, 0.12, 0.09, 0.25, 0.18, 0.12, 0.25],
			voltage: '380/660',
			rpm: [3000, 1500, 1000, 3000, 1500, 1000, 1500],
		},
	},

	{
		standard: 'ESQ',
		techData: {
			frameSize: 225,
			series: ['M2-SDN', 'M4-SDN', 'M6-SDN', 'M8-SDN', 'M10-SDN', 'S4-SDN', 'S8-SDN', 'S10-SDN'],
			power: [45, 45, 30, 22, 18.5, 37, 18.5, 15],
			voltage: '380/660',
			rpm: [3000, 1500, 1000, 750, 600, 1500, 750, 600],
		},
	},
];

//формирование наименований и перечня базовых хар-к:
motorData.forEach((motorType) => {
	motorType.names = [];

	motorType.techData.series.forEach((ser, index) => {
		motorType.names.push(
			`${motorType.standard} ${motorType.techData.frameSize} ${ser} ${motorType.techData.power[index]}/${motorType.techData.rpm[index]}`
		);
	});
});

//фактические данные электродвигателей для клиента:
const motorsAllSeries = [];

motorData.forEach((motorObject) => {
	const { frameSize, power, rpm, voltage } = motorObject.techData;

	motorsAllSeries.push(
		motorObject.names.map((name, index) => ({
			standard: motorObject.standard,
			name,
			frameSize,
			power: power[index],
			rpm: rpm[index],
			voltage,
		}))
	);
});

export const motorsAllSeriesFlatten = motorsAllSeries.flat(Infinity);
