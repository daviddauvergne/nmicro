const dir = require('node-dir');
const path = require('path');

const template = require('./template');
const style = require('./style');
const loc = require('./locale');
const cpJS = require('./component-js');
const toSourceFnc = require('tosource');
const UglifyJS = require('uglify-js');

module.exports = function(component,callback){

	var fncs = [];

	var fn = function(callback){
		return new Promise(
			function(resolve,reject) {
				callback(resolve,reject);
			}
		);
	};

	dir.readFiles(component.folder,{},
		function(err, content, filename, next) {
			var filePath = path.parse(filename);

			switch (filePath.ext) {
				case '.js':
					fncs.push(fn(function(resolve,reject){
						var componentObj = cpJS(component.name,filename,component.config);
						resolve({name:'script',content:componentObj});
					}));
				break;
				case '.json':
					fncs.push(fn(function(resolve,reject){
						loc(filename,component.config.sources,function(result) {
							resolve({name:'locale',lang:filePath.name,content:result});
						});
					}));
				break;
				case '.tpl':
					fncs.push(fn(function(resolve,reject){
						template(component.config.sources,filename,function(tpls){
							resolve({name:'templates',content:tpls});
						},false,false);
					}));
				break;
				case '.scss':
					fncs.push(fn(function(resolve,reject){
						style(component.scssMainFile,component.config.sources,[component.folder],[filePath.name],function(result) {
							resolve({name:'style',content:result});
						});
					}));
				break;

			}
			next();
		},
		function(err, files){
			if (err) {
				console.log(err);
				return null;
			}

			Promise.all(fncs).then(function(data){

				var cp = {
					name : component.name,
					templates : {}
				};
				var match = {};
				var privateScript = '';
				var css = '';
				var tpl = null;
				var locale = {};

				var rulesCSS = null;


				data.forEach(function(el){
					switch (el.name) {
						case 'script':
							for (var k in el.content.public) {
								cp[k] = el.content.public[k];
							}
							if(el.content.private!=='')
								privateScript = el.content.private;

							if(el.content.match)
								cp.match = el.content.match;
						break;
						case 'templates':
							for (var kx in el.content) {
								if(kx==component.name){
									cp.template = el.content[component.name].content;
									rulesCSS = el.content[component.name].rules;
								} else {
									cp.templates[kx] = el.content[kx];
								}
							}
						break;
						case 'style':
							css = el.content;
						break;
						case 'locale':
							locale[el.lang] = el.content;
						break;
					}
				});

				// if(match[component.name])
				// 	cp.match = match[component.name];
				//
				// for (var k in cp.templates) {
				// 	if(match[k]){
				// 		cp.templates[k].match = match[k];
				// 	}
				// }

				var code = `window.$cp = (function(cp) {
				// public
				${privateScript}
				cp.push(${toSourceFnc(cp)});return cp;}(window.$cp||[]));`;

				callback({
					locale: locale,
					css: css,
					string:code,
					rules:rulesCSS
				});
			}).catch(function(data){
				console.log('error compil component');
				console.log(data);
				// log error
				callback(null);
			});
		}
	);
};
