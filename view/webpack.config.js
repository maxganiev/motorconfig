const path = require('path');

module.exports = {
	entry: {
		app: ['babel-polyfill', './index.js'],
	},
	watch: true,
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'app.bundle.js',
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['env', 'stage-0'],
				},
			},
		],
	},
};
