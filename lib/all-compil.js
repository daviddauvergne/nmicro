// all compil
const path = require('path');
const fs = require('fs-extra');
const CleanCSS = require('clean-css');
const libCompil = require('./lib-compil');
const template = require('./template');
const tpl = require('./tpl');
const style = require('./style');
const loc = require('./locale');
const compilLibDefault = require('./lib-default-compil');
const reload = require('require-reload')(require);
const UglifyJS = require('uglify-js');
const logger = require('./logger');
const	getJS = require('./getjs');
const apiCompil = require('./api-compil');
const nConvert = require('./name-convert');
const cpCompil = require('./component-compil');

const socketDevStr = compilLibDefault.getSocketDEvString();
const loggProdStr = compilLibDefault.getLoggProdString();

var finishLangue = function(config,fnc){
	var count = 0;
	var languesLength = config.langues.length;
	return function(whois){
		count++;
		if(count==languesLength && fnc!==undefined)
			fnc(whois);
	};
};

module.exports = {

	lib : function(config,mode,theme,emitMessage,finish){
		libCompil(config,function(data){
			var setting = reload(config.settingFile);
			var settingValue = '';
			if(setting && setting[theme]){
				if(setting[theme][mode.type]){
					if(setting[theme][mode.type][config.devString]){
						settingValue = setting[theme][mode.type][config.devString];
					} else {
						logger.msg([{b_red:'Error setting theme ['+theme+'], out ['+mode.type+'], mode: '+config.devString+' undefined (setting.js)'}]);
					}
				} else {
					logger.msg([{b_red:'Error setting theme ['+theme+'], out: '+mode.type+' undefined (setting.js)'}]);
				}
			} else {
				logger.msg([{b_red:'Error setting theme: '+theme+' undefined (setting.js)'}]);
			}

			var modeThemeData = `
window.MODE = "${mode.type}";
window.THEME = "${theme}";
${settingValue}
${data}
`;

			if(!config.dev){
				var result = UglifyJS.minify(modeThemeData, {fromString:true});
				modeThemeData = result.code;
			}
			if(mode.type=='app'){
				fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,'js',config.mainFileJS)), modeThemeData, function (err) {
					if (err) return console.error(err);
					finish('lib');
				});
			} else {
				var _finish = finishLangue(config,finish);
				config.langues.forEach(function(lang){
					fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,lang,'js',config.mainFileJS)), modeThemeData, function (err) {
						if (err) return console.error(err);
						_finish('lib');
					});
					if(lang==config.defaultLangue)
						emitMessage('_all_');

				});
			}
		});
	},

	medias : function(config,mode,theme,medias,emitMessage,finish) {

		var finishMedias = function(nb){
			var count = 0;
			return function(whois){
				count++;
				if(count==nb && finish!==undefined)
					finish(whois);
			}
		};
		var sourcesMedias = path.join(config.sourcesThemes,theme,'medias');
		var _finish;
		if(mode.type=='app'){
			_finish = finishMedias(medias.length);
			var outMedias = path.join(config.outFolder,mode.type,theme,'medias');
			fs.mkdirs(outMedias, function (err) {
				medias.forEach(function(media) {
					var sourceFile = path.join(sourcesMedias,media);
					var outFile = config.goodUrl.url(mode.type,path.join(outMedias,media));
					fs.copy(sourceFile, outFile, function (err) {
						if (err) return console.error(err);
						_finish('medias');
					});
				});
			});
		} else {
			_finish = finishMedias(medias.length*config.langues.length);
			config.langues.forEach(function(lang){
				var outMedias = path.join(config.outFolder,mode.type,theme,lang,'medias');
				fs.mkdirs(outMedias, function (err) {
					medias.forEach(function(media) {
						var sourceFile = path.join(sourcesMedias,media);
						var outFile = config.goodUrl.url(mode.type,path.join(outMedias,media));
						fs.copy(sourceFile, outFile, function (err) {
							if (err) return console.error(err);
							_finish('medias');
						});
					});
				});
				if(lang==config.defaultLangue)
					emitMessage('_all_');
			});
		}
	},

	pages : function(config,mode,theme,page,emitMessage,finish){
		var pageFolder = path.join(config.sourcesPages,page);
		var jsPageFile = path.join(pageFolder,page+'.js');
		var pageConfig = getJS(jsPageFile,config);

		if(pageConfig.restriction===undefined || pageConfig.restriction==mode.type){

			var tplPageFile = path.join(pageFolder,page+'.tpl');
			var scssMainFile = path.join(config.sourcesThemes,theme,config.varsSCSS);
			var urlMainCSS = mode.relUrl+'css/'+config.mainFileCSS;
			var componentsFile = path.join(config.sourcesCp,page);

			var scenarios = '';
			if(config.dev){
				scenarios = '\nvar SCENARIOS = []';
				if(pageConfig.scenarios && pageConfig.scenarios.length>0){
					scenarios = '\nvar SCENARIOS = '+JSON.stringify(pageConfig.scenarios)+';';
				}
			}

			var componentsPage = [];
			try{
				componentsPage = fs.readdirSync(componentsFile);
			} catch(e){
				componentsPage = [];
			}

			var _finish = finishLangue(config,finish);

			var fn = function(callback){
				return new Promise(
					function(resolve,reject) {
						callback(resolve,reject);
					}
				);
			};

			// apis
			var createApis = function(config,apis,callback){
				var fncsApis = [];
				apis.forEach(function(api){
					fncsApis.push(fn(function(resolve,reject){
						apiCompil({name:api,folder:path.join(config.sourcesApis,api),config:config},function(result) {
							resolve({name:api,content:result});
						});
					}));
				});

				var apiPublicScript = 'window.APIS = (function(){var apis = {';
				var apiLocale = {};
				Promise.all(fncsApis).then(function(data){
					data.forEach(function(el){
						if(el.content.public!==undefined){
							apiPublicScript += el.content.public;
						}
						if(el.content.locale!==undefined){
							apiLocale[nConvert.kebabTocamel(el.name)] = el.content.locale;
						}
					});
					apiPublicScript += `
};

var r = {};
for (var name in apis) {

	r[name] = {};
	var t = r[name];

	for (var route in apis[name].__schema) {
		var nfnc = function(scope,schema) {
			if (schema.req) schema.req = Object.assign({}, this.req, schema.req); else schema.req = this.req;
			if (schema.res == undefined) schema.res = {};
			schema.res.default = this.resDefault;
			window.$load(scope,schema);
		};
		// req
		nfnc.req = apis[name].__schema[route].req;
		nfnc.req.url = apis[name].__url + nfnc.req.url.replace(/^\\/+/,'');
		nfnc.req.method = nfnc.req.method.toUpperCase();
		// error
		if(apis[name].__schema[route].res == undefined)
			apis[name].__schema[route].res = {};
		nfnc.resDefault = apis[name].__schema[route].res;
		for (var errorFnc in apis[name].__res) {
			if (nfnc.resDefault[errorFnc] == undefined) {
				nfnc.resDefault[errorFnc] = apis[name].__res[errorFnc];
			}
		}

		t[route] = nfnc.bind(nfnc);
	}
}

return r;
})();`;
					callback({
						apiPublicScript:apiPublicScript,
						apiLocale:apiLocale
					});
				}).catch(function(data){
					// TODO: log error
					console.log(data);
					callback({
						apiPublicScript:apiPublicScript,
						apiLocale:apiLocale
					});
				});
			};

			var fncs = [];
			if(pageConfig.apis && pageConfig.apis.length>0){
				fncs.push(fn(function(resolve,reject){
					createApis(config,pageConfig.apis,function(contentApis){
						resolve({
							apis:contentApis
						});
					});
				}));
			}
			if(componentsPage.length>0){
				componentsPage.forEach(function(cpName){
					fncs.push(fn(function(resolve,reject){
						cpCompil({
							name:cpName,
							folder:path.join(componentsFile,cpName),
							scssMainFile:scssMainFile,
							dev : config.dev,
							config : config
						},function(result) {
							resolve({cp:cpName,content:result});
						});
					}));
				});
			}

			Promise.all(fncs).then(function(data){
				var jsScript = '';

				var localeAll = {
					api : {},
					cp : global.LC.cpmain
				};
				var cpCSS = '';
				data.forEach(function(el){
					if(el.apis!==undefined){
						jsScript += "\n"+el.apis.apiPublicScript;
						localeAll.api = el.apis.apiLocale;
					}
					if(el.cp!==undefined){
						if(Object.keys(el.content.locale).length>0)
							localeAll.cp[nConvert.kebabTocamel(el.cp)] = el.content.locale;
						cpCSS += el.content.css;
						jsScript += '\n'+el.content.string;
					}
				});

				// page css
				var scssPageFile = path.join(pageFolder,page+'.scss');
				var cssExist = false;
				try {
					cssExist = fs.statSync(scssPageFile);
				} catch (e) {
					cssExist = false;
				}
				var pageFileCSS = config.goodUrl.url(mode.type,mode.relUrl+'css/'+page+'.css');
				var pageFileJS = config.goodUrl.url(mode.type,mode.relUrl+'js/'+page+'.js');
				var mainFileCSS = config.goodUrl.url(mode.type,mode.relUrl+'css/'+config.mainFileCSS);
				var mainFileJS = config.goodUrl.url(mode.type,mode.relUrl+'js/'+config.mainFileJS);
				var mainFileMainCpCSS = config.goodUrl.url(mode.type,mode.relUrl+'css/cpmain.css');
				var mainFileMainCpJS = config.goodUrl.url(mode.type,mode.relUrl+'js/cpmain.js');

				var saveCSSPage = function(cssPage){
					var stringJS = '';
					if(config.dev){
						stringJS = jsScript;
					} else {
						var result = UglifyJS.minify(jsScript, {fromString:true});
						stringJS = result.code;
						cssPage = new CleanCSS().minify(cssPage).styles;
					}
					if(mode.type=='web'){
						config.langues.forEach(function(lang){
							fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,lang,'css',page+'.css')), config.goodUrl.css(mode.type,cssPage), function (err) {
								if (err) return console.error(err);
							});
							fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,lang,'js',page+'.js')), config.goodUrl.js(mode.type,stringJS), function (err) {
								if (err) return console.error(err);
							});
						});
					} else if(mode.type=='app') {
						fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,'css',page+'.css')), config.goodUrl.css(mode.type,cssPage), function (err) {
							if (err) return console.error(err);
						});
						fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,'js',page+'.js')), config.goodUrl.js(mode.type,stringJS), function (err) {
							if (err) return console.error(err);
						});
					}
				};

				if(cssExist){
					style(scssMainFile,config.sources,[pageFolder],[page],function(cssPage) {
						saveCSSPage(cssPage+cpCSS);
					});
				} else {
					saveCSSPage(cpCSS);
				}

				// page html
				template(config.sources,tplPageFile,function(tpls){
					config.langues.forEach(function(lang){
						var localePageFile = path.join(config.sourcesPages,page,'locale',lang+'.json');
						var locale = {
							api : {},
							cp : {}
						};
						for (var m in localeAll) {
							for (var n in localeAll[m]) {
								locale[m][n] = localeAll[m][n][lang];
							}
						}
						locale = JSON.stringify(locale);
						loc(localePageFile,config.sources,function(result) {
							var pageHeader = '';
							if(tpls.header){
								pageHeader = tpl(tpls.header.content,result);
							}
							var socketIoJS = loggProdStr;

							if(mode.type=='web'){
								if(config.dev)
									socketIoJS = socketDevStr;
							}
							pageHeader = config.goodUrl.html(mode.type,pageHeader);
							var html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
${socketIoJS}
<link rel="stylesheet" href="${mainFileCSS}"/>
<link rel="stylesheet" href="${mainFileMainCpCSS}"/>
<link rel="stylesheet" href="${pageFileCSS}"/>
${pageHeader}
<script type="text/javascript">
LC = ${locale};${scenarios}
</script>
<script type="text/javascript" src="${mainFileJS}"></script>
<script type="text/javascript" src="${mainFileMainCpJS}"></script>
<script type="text/javascript" src="${pageFileJS}"></script>
</head>
</html>`;
							if(mode.type=='app'){
								fs.outputFile(path.join(config.outFolder,mode.type,theme,'html',lang,page+'.html'), html, function (err) {
									if (err) return console.error(err);
									_finish('page: '+page);
								});
							} else {
								fs.outputFile(path.join(config.outFolder,mode.type,theme,lang,page+'.html'), html, function (err) {
									if (err) return console.error(err);
									_finish('page: '+page);
								});

								if(lang==config.defaultLangue)
									emitMessage(page);
							}
						});
					});
				},true,false);
			});
		} else {
			finish('page: '+page);
		}
	},

	mainCss : function(config,mode,theme,emitMessage,finish){
		var mainFile = path.join(config.sourcesThemes,theme,config.varsSCSS);
		var includePaths = [path.join(config.sourcesThemes,theme)];
		var includeFile = ['main'];
		style(mainFile,config.sources,includePaths,includeFile,function(result) {

			if(!config.dev)
				result = new CleanCSS().minify(result).styles;

			if(mode.type=='app'){

				fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,'css',config.mainFileCSS)), config.goodUrl.css(mode.type,result), function (err) {
					if (err) return console.error(err);
					finish('mainCss');
				});
			} else {
				var _finish = finishLangue(config,finish);

				config.langues.forEach(function(lang){
					fs.outputFile(config.goodUrl.url(mode.type,path.join(config.outFolder,mode.type,theme,lang,'css',config.mainFileCSS)), config.goodUrl.css(mode.type,result), function (err) {
						if (err) return console.error(err);
						_finish('mainCss');
					});
					if(lang==config.defaultLangue)
						emitMessage('_all_');
				});
			}
		});
	}
};