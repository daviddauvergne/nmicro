
const reload = require('require-reload')(require);
const fs = require('fs-extra');

var saveSetting = function(config,setting){
var content = `
module.exports = ${JSON.stringify(setting,null,' ')};`;
fs.outputFileSync(config.settingFile, content);
};

module.exports = {

	add: function(config,themeName){
		var setting = reload(config.settingFile);
		setting[themeName] = setting.default;
		saveSetting(config,setting);
	},
	del: function(config,themeName){
		var setting = reload(config.settingFile);
		if(setting[themeName]){
			delete setting[themeName];
			saveSetting(config,setting);
		}
	}
};
