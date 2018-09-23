// doc with docGenerator
const path = require('path');
const pjson = require('./package.json');
module.exports = {
	version: pjson.version,
	files: [
		path.join(__dirname, 'README.md'),
		path.join(__dirname, 'data/components/xxx.js'),
		path.join(__dirname, 'lib-default/cp.js'),
		path.join(__dirname, 'data/components/xxx.tpl')
	],
	save: path.join(__dirname, 'doc.md')
};
