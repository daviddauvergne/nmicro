
const Module = require('module');
const fs = require('fs');
const reload = require('require-reload')(require);
const	logger = require('./logger');
var regLogg = /console\.(log|warn|error|info|debug)\(/g;

module.exports = function(file,config){
	var js = {};
	var nameFile = file.substring(config.sources.length+1);
	if(!config.dev){
		try {
			js = reload(file);
		} catch (err) {
			var x = err.stack.split('\n');
			logger.msg([{b_red:'Error: '},{blue:nameFile},{b_blue:' '+x[3]}]);
		}
		return js;
	} else {
		var content;
		try {
			content = Array.prototype.map.call(fs.readFileSync(file,'utf8').split('\n'),function(line,l){
				l = l+1;
				return line.replace(regLogg,'console.$1("%c['+nameFile+':'+l+']","color:gray;font-size:12px ! important; text-decoration: none;",')+'//['+l+'|'+nameFile+']';
			}).join('\n');
				try {
					var Module = module.constructor;
					var m = new Module();
					m._compile(content, '');
					js = m.exports;
				} catch (err) {
					var x = err.stack.split('\n');
					logger.msg([{b_red:'Error: '},{blue:nameFile},{b_blue:' '+x[3]}]);
				}
				return js;
		} catch (err) {
			var x = err.stack.split('\n');
			logger.msg([{b_red:'Error: '},{blue:nameFile},{b_blue:' '+x[3]}]);
			return js;
		}
	}
};
