const toSourceFnc = require('tosource');
const nConvert = require('./name-convert');
const	getJS = require('./getjs');
module.exports = function(jsName,jsFile,config){
	var js = getJS(jsFile,config);
	var jsprivate = '';
	var match = null;
	if(js.private){
		jsprivate = 'var private = '+toSourceFnc(js.private)+';';
		delete js.private;
	}
	if(!config.dev && js.scenarios)
		delete js.scenarios;

	if(js.match){
		match = js.match;
		delete js.match;
	}

	return {
		public : js,
		private : jsprivate,
		match:match
	}
};
