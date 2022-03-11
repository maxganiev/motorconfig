export const priceConfig = {
	getMotorPrice: async function (frameSize) {
		switch (frameSize) {
			case 50:
				this.motorPrice = 100;
				break;

			case 63:
				this.motorPrice = 200;
				break;

			case 200:
				this.motorPrice = 400;
				break;
		}
	},

	getTotalCost: async function (brakeType) {
		if (brakeType === '-') {
			this.totalCost = this.motorPrice;
		} else {
			//this.totalCost = this.motorAndBrakePrice
		}
	},
};
