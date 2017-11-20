
const dir = require('node-dir');
const path = require('path');
const sass = require('node-sass');
const	logger = require('./logger');

var _import = function(includeFile){
	return '\n@import "'+includeFile.join('","')+'";';
};

var _toSass = function(obj,callback){
	sass.render({
		includePaths : [obj.config.sources,obj.includePaths],
		data: global.varsSCSS[obj.theme] + _import(obj.includeFile)
	}, function(err, result) {
		if (err) {
			logger.msg([{b_red:'Error: '},{blue:err.file.substring(obj.config.sources.length+1)+':'+err.line},{b_yellow:' '+err.message}]);
			// TODO: log error
			return callback(null);
		}
		callback(result.css.toString());
	});
};
module.exports = function(obj,callback){
	if(obj.vars){
		var data = '';
		var varsDir = path.join(obj.config.sourcesThemes,obj.theme,obj.config.varsSCSS);
		dir.readFiles(varsDir,
			function(err, content, filename, next) {
				data += content;
				next();
			},
			function(err, files){
				if (err) {
					console.log(err);
					return callback(null);
				}
				global.varsSCSS[obj.theme] = data;
				_toSass(obj,callback);
			}
		);
	} else {
		_toSass(obj,callback);
	}
};
