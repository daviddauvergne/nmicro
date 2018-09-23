
const path = require('path');
const fs = require('fs-extra');
const nodedir = require('node-dir');
const	getJS = require('./getjs');
const settingUpdate = require('./setting-update');
const extValid = ['js', 'tpl', 'json', 'html', 'md', 'scss', 'json'];
const extValidComment = ['js', 'tpl', 'scss'];

const commentPattern = require('comment-patterns');
const commentPatternReg = require('comment-patterns/build/variations/regexes');

var optionsTPL = {
	name: 'Template',
	nameMatchers: ['.tpl'],
	// singleLineComment: [{ start: '#' }],
	multiLineComment: [{start: '<!--', middle: '', end: '-->'}]
};

const removeComment = function (file, content) {
	var ext = path.extname(file);
	switch (ext) {
		case '.js':
		case '.scss':
			var rejs = commentPattern.regex(file);
			content = content.replace(rejs.regex, function () {
				if (arguments[4])	return '';
				else return arguments[5];
			});
			break;
		case '.tpl':
			var retpl = commentPatternReg(optionsTPL);
			content = content.replace(retpl.regex, '');
			break;
	}
	return content;
};

var createEl = function (config, type, name, dir, comment) {
	var sourceDataType = path.join(config.dataFolder, type);
	nodedir.readFiles(sourceDataType,
		function (err, content, filename, next) {
			var fileExtention = filename.substring(filename.lastIndexOf('.') + 1);

			var pathFile = filename.substring(sourceDataType.length + 1).replace(/xxx/g, name);

			if (type === 'components') {
				pathFile = path.join(config.sources, type, dir, name, pathFile);
			} else {
				pathFile = path.join(config.sources, type, name, pathFile);
			}
			if (extValid.indexOf(fileExtention) > -1) {
				content = content.replace(/xxx/g, name);
				if (!comment && type === 'components' && extValidComment.indexOf(fileExtention) > -1) {
					content = removeComment(pathFile, content);
				}
			}
			fs.outputFileSync(pathFile, content);
			next();
		},
		function (err, files) {
			//
		}
	);
};

var typeFolder = {
	api: 'apis',
	component: 'components',
	theme: 'themes',
	page: 'pages'
};

var stalker;

module.exports = function (nmicro, config) {
	fs.ensureDirSync(config.sourcesCp);
	fs.ensureDirSync(path.join(config.sourcesCp, 'main'));
	var url = 'http://' + config.serverIP + ':' + config.serverPort + '/';
	return {
		pushStalker: function (_stalker) {
			stalker = _stalker;
		},
		createThemeDefault: function (config) {
			createEl(config, typeFolder.theme, 'default', null, false);
		},
		create: function (req, res, next) {
			stalker.stop();
			if (typeFolder[req.params.type]){
				createEl(config,typeFolder[req.params.type],req.params.name,req.params.dir,req.params.comment);
				if(req.params.type=='api'){
					fs.copySync(
						path.join(config.dataFolder,'rest.js'),
						path.join(config.sources,'rest',req.params.name+'-rest.js')
					);
				} else if(req.params.type=='theme'){
					settingUpdate.add(config,req.params.name);
				}
			}
			res.send('ok');
			stalker.start();
			return next();
		},
		del : function(req, res, next) {
			stalker.stop();
			var pathFolder = '';
			if(req.params.dir===undefined || req.params.dir==='' || req.params.dir===null){
				pathFolder = path.join(config.sources,typeFolder[req.params.type],req.params.name);
			} else {
				pathFolder = path.join(config.sources,typeFolder[req.params.type],req.params.dir,req.params.name);
			}
			fs.removeSync(pathFolder);
			if(req.params.type=='api'){
				var restFile = path.join(config.sources,'server',req.params.name+'-rest.js');
				if(fs.existsSync(restFile)){
					fs.unlinkSync(restFile);
				}
			} else if (req.params.type === 'theme') {
				settingUpdate.del(config, req.params.name);
			}
			res.send('ok');
			stalker.start();
			return next();
		},
		home: function (req, res, next) {
			var isUnixHiddenPath = function (path) {
				return !(/(^|\/)\.[^\/\.]/g).test(path);
			};
			var types = {
				theme: fs.readdirSync(config.sourcesThemes),
				component: {},
				api: fs.readdirSync(config.sourcesApis),
				page: fs.readdirSync(config.sourcesPages)
			};
			types.component.main = fs.readdirSync(path.join(config.sourcesCp, 'main')).filter(isUnixHiddenPath);
			var restriction = {};
			types.page.forEach(function (page) {
				var pageFile = path.join(config.sourcesPages, page, page + '.js');
				var js = getJS(pageFile, config);
				restriction[page] = js.restriction;
				try {
					types.component[page] = fs.readdirSync(path.join(config.sourcesCp, page)).filter(isUnixHiddenPath);
				} catch (e) {
					types.component[page] = [];
				}
			});

		var pagesLink = Array.from(new Set(types.page)).map(function(page) {
			var link = url+page+'.html';
			if(config.defaultMode=='app'){
				return '<p class="pageLink"><span style="color:gray">'+link+'</span></p>';
			} else {
				if(restriction[page] && restriction[page]=='app')
					return '<p class="pageLink"><span style="color:gray">'+link+' (restriction: "app")</span></p>';
				return '<p class="pageLink"><a href="'+link+'">'+link+'</a></p>';
			}
		});

		var items = function(type){
			return types[type].map(function(name) {
				if(type=='theme' && name=="default")
					return '<div class="themedefault" data-name="'+name+'" data-type="'+type+'">'+name+'</div>';
				return '<div class="item" data-name="'+name+'" data-type="'+type+'">'+name+'</div>';
			}).join('');
		};

		var componentsItems = function(){
			var str = '';
			for (var p in types.component) {
				str += '<hr/>';
				str += types.component[p].map(function(name) {
					return '<div class="item" data-name="'+name+'" data-type="component" data-dir="'+p+'"><span class="item-p">'+p+'</span> '+name+'</div>';
				}).join('');
			}
			return str;
		};
		var pagesComponent = function(){
			var pCp = ['main'].concat(types.page);
			return pCp.map(function(name) {
				return '<option value="'+name+'">'+name+'</option>';
			}).join('');
		};

		res.end(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
<meta name="google" content="notranslate">
<script>
var URL = '${url}';
var capitalizeFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

var postData = function(action,type,name,dir,comment){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			if ( xhr.status === 200  ) {
				setTimeout(function () {
					location.reload();
				}, 300);
			} else {
				alert(xhr.status+' '+xhr.responseText);
				document.body.classList.remove("action");
			}
		}
	};
	document.body.classList.add("action");
	xhr.open("POST", URL+"nmicro/"+action);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send(JSON.stringify({ type: type, name: name, dir: dir, comment: comment }));
};

document.addEventListener( "DOMContentLoaded",function(){
	var cpCommentEl = document.getElementById('cp-comment');
	if (sessionStorage.getItem("cp-comment")) {
		cpCommentEl.checked = JSON.parse(sessionStorage.getItem("cp-comment"));
	}

	cpCommentEl.addEventListener('change', function(event){
		sessionStorage.setItem('cp-comment', this.checked);
	}, false);

	document.getElementById('compilall').addEventListener('click', function(event){
		postData('compilall','','','',false);
	}, false);
	[].forEach.call(document.querySelectorAll('.item'), function(el) {
		el.addEventListener('click', function(event){
			if(!document.body.classList.contains("action")){
				var type = this.dataset.type;
				var name = this.dataset.name;
				var dir = this.dataset.dir;
				if (confirm("Delete "+type+': '+name)) {
					postData('del',type,name,dir,cpCommentEl.checked);
				}
			}
		}, false);
	});
	[].forEach.call(document.querySelectorAll('.add'), function(el) {
		el.addEventListener('click', function(event){
			var type = this.dataset.type;
			var name = document.querySelector('input[data-input="'+type+'"]').value;
			var dir = '';
			var selctDirEl = document.querySelector('select[data-dir="'+type+'"]');
			if(selctDirEl)
				dir = selctDirEl.value;

			if (name != null) {
					var res = /^([a-z|\\-|_]{2,})$/.test(name);
					if(res){
						postData('create',type,name,dir,cpCommentEl.checked);
					} else {
						alert('Invalid name !\\n\\n [a-z|\\-|_]{2,}');
					}
			}
		}, false);
	});
});
</script>
<style type="text/css">
body {
	font-size:15px;
	font-family: sans-serif;
}

body > h1 {
	text-transform: uppercase;
	text-align: center;
}

body > h2 {
	text-align: center;
	font-size:14px;
}

body > div.container {
	width:1000px;
	margin: auto;
}
body > div > div.left {
	float:left;
}
body > div > div.right {
	float:right
}

body > div > div > div {
	margin: 10px;
	border: 1px solid #c3c3c3;
	padding: 10px;
	font-size:13px;
}

a {
	color:blue ! important;
}

.pageLink {
	margin:5px auto;
}

.item,
.themedefault {
	cursor: default;
	padding: 3px;
	margin: 3px 0;
}

.item > .item-p {
	cursor: default;
	color:gray;
	display:inline-block;
	width:180px;
	text-align:right;
}
.item > .item-p:after {
	content:' - '
}

.adt {
	text-align: left;
	margin-right: 10px;
}

.item:after {
	position: absolute;
	cursor: pointer;
	display: none;
	content:"✖";
	margin-left: 5px;
	color: red;
	font-size: 1.2em;
}

.item:hover:after {
	display: inline-block;
}

.action {
	background:whitesmoke;
	color: gray !important;
}

.action button,
.action input,
.action .item:after {
	display:none;
}

.action .pageLink a {
	pointer-events: none;
	cursor: default;
	text-decoration:none;
	color:gray !important;
}

</style>
</head>
<body>
	<h1>${nmicro.name}</h1>
	<h2>VERSION: ${nmicro.version}</h2>
	<div class="container">
		<div class="left">
			<div>
				<h2><span class="adt">Components</span>
				<input data-input="component"/> <select data-dir="component">${pagesComponent()}</select> <button class="add" data-type="component">+</button><input id="cp-comment" type="checkbox" checked="checked"/></h2>
				<div>${componentsItems()}</div>
			</div>
		</div>
		<div class="right">
			<div>
				<h2>PROJECT: ${config.name}</h2>
				<pre>${config.dir}</pre>
				<div style="text-align:center;"><button id="compilall">Compil all</button></div>
			</div>
			<div>
				<h2>URLS <span style="font-size:0.7em;color:gray;font-weight:normal;">Default mode: ${config.defaultMode}</span></h2>
				<div>${pagesLink.join('')}</div>
			</div>
			<div>
				<h2><span class="adt">Pages</span><input data-input="page"/><button class="add" data-type="page">+</button></h2>
				<div>${items('page')}</div>
			</div>
			<div>
				<h2><span class="adt">Apis</span><input data-input="api"/><button class="add" data-type="api">+</button></h2>
				<div>${items('api')}</div>
			</div>
			<div>
				<h2><span class="adt">Themes</span><input data-input="theme"/><button class="add" data-type="theme">+</button></h2>
				<p style="color:gray;">After an operation on "themes", it is necessary to restart nmicro</p>
				<div>${items('theme')}</div>
			</div>
		</div>
	</div>
	<br/><br/>
</body>
</html>`);
			return next();
		}
	};
};
