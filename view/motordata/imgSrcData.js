export const imgSrcData = {};
export const setImgSrcData = function (frameSize, encoderIsChecked, ventSystemOptionValue, conicShaftIsChecked) {
	if (encoderIsChecked || ventSystemOptionValue !== '-') {
		imgSrcData.data = [
			//"e": true, "v": "-", "b": "-"
			{ i: 0, path: 'encoder.png' },

			//"e": true, "v": "-", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 1, path: 'tormoz_nezavisimoe_pitanie_encoder.png' },

			//"e": true, "v": "-", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 2, path: 'tormoz_nezavisimoe_pitanie_encoder.png' },

			//"e": true, "v": "-", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{ i: 3, path: 'tormoz_nezavisimoe_pitanie_ruchka_encoder.png' },

			//"e": true, "v": "-", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством (ET1ET2)"
			{ i: 4, path: 'tormoz_nezavisimoe_pitanie_ruchka_encoder.png' },

			//"e": true, "v": "Встроенный вентилятор с питанием 220В", "b": "-"
			{ i: 5, path: frameSize <= 159 ? 'vent_encoder.png' : 'vent_encoder_big.png' },

			//"e": true, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{
				i: 6,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_vent_encoder_big.png',
			},

			//"e": true, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{
				i: 7,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_vent_encoder_big.png',
			},

			//"e": true, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{
				i: 8,
				path:
					frameSize <= 150
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder_big.png',
			},

			//"e": true, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{
				i: 9,
				path:
					frameSize <= 150
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder_big.png',
			},

			//"e": true, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "-"
			{ i: 10, path: frameSize <= 159 ? 'vent_encoder.png' : 'vent_encoder_big.png' },

			//"e": true, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{
				i: 11,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_vent_encoder_big.png',
			},

			//"e": true, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{
				i: 12,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_vent_encoder_big.png',
			},

			//"e": true, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{
				i: 13,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder_big.png',
			},

			//"e": true, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{
				i: 14,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_encoder_big.png',
			},

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "-"
			{ i: 15, path: 'encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 16, path: 'tormoz_nezavisimoe_pitanie_encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 17, path: 'tormoz_nezavisimoe_pitanie_encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{ i: 18, path: 'tormoz_nezavisimoe_pitanie_ruchka_encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{ i: 19, path: 'tormoz_nezavisimoe_pitanie_ruchka_encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "-"
			{ i: 20, path: 'encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 21, path: 'tormoz_nezavisimoe_pitanie_encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 22, path: 'tormoz_nezavisimoe_pitanie_encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{ i: 23, path: 'tormoz_nezavisimoe_pitanie_ruchka_encoder.png' },

			//"e": true, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{ i: 24, path: 'tormoz_nezavisimoe_pitanie_ruchka_encoder.png' },

			//"e": false, "v": "-", "b": "-"
			{ i: 25, path: '' },

			//"e": false, "v": "-", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 26, path: 'tormoz_nezavisimoe_pitanie.png' },

			//"e": false, "v": "-", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 27, path: 'tormoz_nezavisimoe_pitanie.png' },

			//"e": false, "v": "-", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{ i: 28, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },

			//"e": false, "v": "-", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{ i: 29, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },

			//"e": false, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "-"
			{ i: 30, path: frameSize <= 159 ? 'vent.png' : 'vent_big.png' },

			//"e": false, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 31, path: frameSize <= 159 ? 'tormoz_nezavisimoe_pitanie_vent.png' : 'tormoz_nezavisimoe_pitanie_vent_big.png' },

			//"e": false, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 32, path: frameSize <= 159 ? 'tormoz_nezavisimoe_pitanie_vent.png' : 'tormoz_nezavisimoe_pitanie_vent_big.png' },

			//"e": false, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{
				i: 33,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_big.png',
			},

			//"e": false, "v": "Встроенный вентилятор с питанием 220В (V1)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{
				i: 34,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_big.png',
			},

			//"e": false, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "-"
			{ i: 35, path: frameSize <= 159 ? 'vent.png' : 'vent_big.png' },

			//"e": false, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 36, path: frameSize <= 159 ? 'tormoz_nezavisimoe_pitanie_vent.png' : 'tormoz_nezavisimoe_pitanie_vent_big.png' },

			//"e": false, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 37, path: frameSize <= 159 ? 'tormoz_nezavisimoe_pitanie_vent.png' : 'tormoz_nezavisimoe_pitanie_vent_big.png' },

			//"e": false, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{
				i: 38,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_big.png',
			},

			//"e": false, "v": "Встроенный вентилятор с питанием 380В (V2)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{
				i: 39,
				path:
					frameSize <= 159
						? 'tormoz_nezavisimoe_pitanie_ruchka_vent.png'
						: 'tormoz_nezavisimoe_pitanie_ruchka_vent_big.png',
			},

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "-"
			{ i: 40, path: 'self.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 41, path: 'tormoz_nezavisimoe_pitanie.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 42, path: 'tormoz_nezavisimoe_pitanie.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{ i: 43, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 220В (V3)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{ i: 44, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "-"
			{ i: 45, path: 'self.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 220В) с независимым питанием (ED1)"
			{ i: 46, path: 'tormoz_nezavisimoe_pitanie.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 380В) с независимым питанием(ET1)"
			{ i: 47, path: 'tormoz_nezavisimoe_pitanie.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 220В) с независимым питанием и ручным растормаживающим устройством (ED1ED2)"
			{ i: 48, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },

			//"e": false, "v": "Пристроенный вентилятор (наездник) с питанием 380В (V4)", "b": "Тормоз (питание 380В) с независимым питанием и ручным растормаживающим устройством(ET1ET2)"
			{ i: 49, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },
		];
	} else {
		imgSrcData.data = [
			//e: false, v: '-', b: '-'
			{ i: 0, path: frameSize < 200 || !conicShaftIsChecked ? '' : 'self.png' },
			//e: false, v: '-', b: 'Тормоз (питание 220В)'
			{ i: 1, path: 'tormoz.png' },
			//e: false, v: '-', b: 'Тормоз (питание 380В)
			{ i: 2, path: 'tormoz.png' },
			//e: false, v: '-', b: 'Тормоз (питание 220В) с независимым питанием
			{ i: 3, path: 'tormoz_nezavisimoe_pitanie.png' },
			//e: false, v: '-', b: 'Тормоз (питание 380В) с независимым питанием
			{ i: 4, path: 'tormoz_nezavisimoe_pitanie.png' },
			//e: false, v: '-', b: 'Тормоз (питание 220В)  с ручным растормаживающим устройством
			{ i: 5, path: 'tormoz_ruchka.png' },
			//e: false, v: '-', b: 'Тормоз (питание 38В)  с ручным растормаживающим устройством
			{ i: 6, path: 'tormoz_ruchka.png' },
			//b: "Тормоз (питание 220В) с независимым питанием и…ным растормаживающим устройством" e: false v: "-"'
			{ i: 7, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },
			//b: "Тормоз (питание 380В) с независимым питанием и…ным растормаживающим устройством" e: false v: "-"'
			{ i: 8, path: 'tormoz_nezavisimoe_pitanie_ruchka.png' },
		];
	}
};
