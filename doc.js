const docGenerator = require('./lib/docGenerator');
const pjson = require('./package.json');
const path = require('path');

var files = [
	path.join(__dirname,'README.md'),
	path.join(__dirname,'data/components/xxx.js'),
	path.join(__dirname,'lib-default/cp.js'),
	path.join(__dirname,'data/components/xxx.tpl')
];

docGenerator(path.join(__dirname,'doc.md'),files,pjson.version);
