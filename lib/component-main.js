// all compil
const path = require('path');
const fs = require('fs-extra');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');

const nConvert = require('./name-convert');
const cpCompil = require('./component-compil');

module.exports = function(config,mode,theme,emitMessage,finish){

	var componentsMainFile = path.join(config.sourcesCp,'main');

	var componentsMain= [];
	try{
		componentsMain = fs.readdirSync(componentsMainFile);
	} catch(e){
		componentsMain = [];
	}

	var fn = function(callback){
		return new Promise(
			function(resolve,reject) {
				callback(resolve,reject);
			}
		);
	};

	var fncs = [];

	if(componentsMain.length>0){
		componentsMain.forEach(function(cpName){
			var folderCP = path.join(componentsMainFile,cpName);
			fncs.push(fn(function(resolve,reject){
				cpCompil({
					name:cpName,
					folder:folderCP,
					theme:theme,
					dev : config.dev,
					config : config
				},function(result) {
					resolve({cp:cpName,content:result,folderCP:folderCP});
				});
			}));
		});
	}

	Promise.all(fncs).then(function(data){
		var cpMainScript = '';
		var cpMainCSS = '';
		global.LC.cpmain = {};
		data.forEach(function(el){
			if(el.cp!==undefined){
				if(Object.keys(el.content.locale).length>0)
					global.LC.cpmain[nConvert.kebabTocamel(el.cp)] = el.content.locale;
				cpMainCSS += el.content.css;
				cpMainScript += '\n'+el.content.string;
				if(el.content.rules){
					fs.outputFile(path.join(el.folderCP,el.cp+'.rules'), el.content.rules, function (err) {
						if (err) return console.error(err);
					});
				}
			}
		});

		var mainFileMainCpCSS = config.goodUrl.url(mode.type,mode.relUrl+'css/cpmain.css');
		var mainFileMainCJS = config.goodUrl.url(mode.type,mode.relUrl+'js/cpmain.js');

		var stringMainCpJS = '';
		if(config.dev){
			stringMainCpJS = cpMainScript;
		} else {
			var resultMainCp = UglifyJS.minify(cpMainScript, {fromString:true});
			stringMainCpJS = resultMainCp.code;
			cpMainCSS = new CleanCSS().minify(cpMainCSS).styles;
		}
		if(mode.type=='web'){
			config.langues.forEach(function(lang){
				fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,lang,'css','cpmain.css')), config.goodUrl.css(mode.type,cpMainCSS), function (err) {
					if (err) return console.error(err);
				});
				fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,lang,'js','cpmain.js')), config.goodUrl.js(mode.type,stringMainCpJS), function (err) {
					if (err) return console.error(err);
				});
			});
		} else if(mode.type=='app') {
			fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,'css','cpmain.css')), config.goodUrl.css(mode.type,cpMainCSS), function (err) {
				if (err) return console.error(err);
			});
			fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,'js','cpmain.js')), config.goodUrl.js(mode.type,stringMainCpJS), function (err) {
				if (err) return console.error(err);
			});
		}

		finish();
	});
};
