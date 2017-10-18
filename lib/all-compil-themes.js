
//commpli all themes
const compil = require('./all-compil');
const compilCpMain = require('./component-main');

const path = require('path');
const fs = require('fs-extra');
var getMode = require('./mode');
var dir = require('node-dir');

module.exports = function(config,emitMessage,final){

	var loopLength = config.themes.length*config.modes.length;
	var pagesLength = loopLength*config.pages.length;
	var puts = pagesLength+(loopLength*3);
	putsCount = 0;
	var toPuts = function(whois){
		putsCount++;
		if(putsCount==puts && final!==undefined)
			final();
	};

	fs.emptyDir(config.outFolder, function (err) {

		config.themes.forEach(function(theme){

			config.modes.forEach(function(_mode){
				var mode = getMode(_mode);

				// mainCp
				compilCpMain(config,mode,theme,emitMessage,function(){
					// pages
					config.pages.forEach(function(page){
						compil.pages(config,mode,theme,page,emitMessage,toPuts);
					});
				});

				// lib
				compil.lib(config,mode,theme,emitMessage,toPuts);

				// mainCss
				compil.mainCss(config,mode,theme,emitMessage,toPuts);

				// medias
				var mediasDir = path.join(config.sourcesThemes,theme,'medias');
				dir.files(mediasDir, function(err, files) {
					if (err) throw err;
					var mediasFiles = [];
					files.forEach(function(file) {
						mediasFiles.push(file.substring(mediasDir.length+1));
					});
					if(mediasFiles.length>0)
						compil.medias(config,mode,theme,mediasFiles,emitMessage,toPuts);
				});
			});
		});
	});
};
