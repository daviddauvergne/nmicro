// watch
const compil = require('./all-compil');
const compilCpMain = require('./component-main');
const remove = require('./all-remove');
const restify = require('restify');
const routesLoad = require('./routes-load');
const path = require('path');
const watchr = require('watchr');
const fs = require('fs-extra');
var routes = {};
const Ajv = require('ajv');


module.exports = function(config,mode,logger,server,emitMessage){
	var loadSchema = function(name){
		try {
			var schema = JSON.parse(fs.readFileSync(path.join(config.sourcesSchemas,name+'.json'), 'utf8'));
			return schema;
		} catch (e) {
			logger.msg([{red:'Error load schema: '+name}]);
			return '';
		}
	};

	var routing = function(req, res, next) {
		if(routes[req.url]){
			var schema = loadSchema(req.url);
			if(schema!==''){
				var ajv = new Ajv({allErrors: true});
				var validate = ajv.compile(schema);
				var valid = validate(req.params);
				if (!valid) {
					return next(new restify.errors.BadRequestError(ajv.errorsText(validate.errors)));
				} else {
					logger.info(['Schema valid: '+req.url]);
				}
			}
			return routes[req.url](req, res, next, restify);
		} else {
			logger.msg([{b_red:'404: '},{blue:req.url},{b_blue:' Not Found'}]);
			return next(new restify.NotFoundError('Not Found: '+req.url));
		}
	};

	server.get(/^\/(.*)/, routing);
	server.post(/^\/(.*)/, routing);
	server.put(/^\/(.*)/, routing);
	server.del(/^\/(.*)/, routing);
	routesLoad(config.sourcesRest,function(_routes){
		routes = _routes;
	});
	var listener = function (changeType, fullPath, currentStat, previousStat) {

		var p = path.parse(fullPath);
		var isDir = true;
		if(p.ext)
			isDir = false;

		var version = null;
		if(changeType!='delete')
			version = new Date(currentStat.mtime).getTime();

		var shortPath = fullPath.substring(config.sources.length+1);

		logger.msg([{blue:'File change: '},{cyan:shortPath}]);

		var pathArr = shortPath.split('/');

		var typeDoc = null;
		var name = null;

		if(pathArr[0] && pathArr[0]!='')
			typeDoc = pathArr[0];

		if(pathArr[1] && pathArr[1]!='')
			name = pathArr[1];

		typeAction(config,mode,server,emitMessage,{
			isDir : isDir,
			changeType : changeType,
			fullPath : fullPath,
			version : version,
			typeDoc : typeDoc,
			name : name,
			pathArr : pathArr
		});

	};
	var next = function (err) {
		if ( err )  return console.log('watch failed on', path, 'with error', err);

		logger.msg([{b_black:'watch successful on'}]);
	};

	// Watch the path with the change listener and completion callback
	var stalker = watchr.open(config.sources, listener, next);

	stalker.setConfig({catchupDelay: 300});
};

var toPuts = function(){};

var typeAction = function(config,mode,server,emitMessage,data){
	switch (data.typeDoc) {
		case 'rest':
			routesLoad(config.sourcesRest,function(_routes){
				routes = _routes;
			});
		break;
		case 'setting.js':
		case 'lib':
			if(!data.isDir)
				compil.lib(config,mode,config.defaultTheme,emitMessage,toPuts);
		break;
		case 'pages':
			if(data.changeType!='delete' && data.name){
				config.pages = fs.readdirSync(config.sourcesPages);
				compil.pages(config,mode,config.defaultTheme,data.name,emitMessage,toPuts);
			}
		break;
		case 'themes':
			if(!data.isDir && data.name==config.defaultTheme){
				if(data.pathArr[2]){
					config.themes = fs.readdirSync(config.sourcesThemes);
					if(data.pathArr[2]=='medias'){
						if(data.pathArr[3]){
							if(data.changeType!='delete'){
								compil.medias(config,mode,config.defaultTheme,[data.pathArr[3]],emitMessage,toPuts);
							} else {
								remove.medias(config,mode,config.defaultTheme,[data.pathArr[3]],emitMessage,toPuts);
							}
						}
					} else if(data.pathArr[2]=='main.scss'){
						compil.mainCss(config,mode,config.defaultTheme,emitMessage,toPuts);
					} else if(data.pathArr[2]=='vars.scss'){
						compil.mainCss(config,mode,config.defaultTheme,emitMessage,function(){
							compilCpMain(config,mode,config.defaultTheme,emitMessage,function(){
								config.pages = fs.readdirSync(config.sourcesPages);
								config.pages.forEach(function(page){
									compil.pages(config,mode,config.defaultTheme,page,emitMessage,toPuts);
								});
							});
						});
					}
				}
			}
		break;
		case 'components':
			config.pages = fs.readdirSync(config.sourcesPages);
			if(data.name=='main'){
				compilCpMain(config,mode,config.defaultTheme,emitMessage,function(){
					config.pages.forEach(function(page){
						compil.pages(config,mode,config.defaultTheme,page,emitMessage,toPuts);
					});
				});
			} else {
				compil.pages(config,mode,config.defaultTheme,data.name,emitMessage,toPuts);
			}
		break;
		case 'apis':
			config.pages = fs.readdirSync(config.sourcesPages);
			compilCpMain(config,mode,config.defaultTheme,emitMessage,function(){
				config.pages.forEach(function(page){
					compil.pages(config,mode,config.defaultTheme,page,emitMessage,toPuts);
				});
			});
		break;
		default:
			compil.mainCss(config,mode,config.defaultTheme,emitMessage,function(){
				compilCpMain(config,mode,config.defaultTheme,emitMessage,function(){
					config.pages = fs.readdirSync(config.sourcesPages);
					config.pages.forEach(function(page){
						compil.pages(config,mode,config.defaultTheme,page,emitMessage,toPuts);
					});
				});
			});
		break;
	}
};
