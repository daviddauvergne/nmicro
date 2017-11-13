const buffer = require('buffer');
const Parser = require('node-expat').Parser;
const hljs = require('highlight.js');
const path = require('path');
const	logger = require('./logger');
const encode = 'UTF-8';

const _elementString = function(name,attrs) {
	var str = '';
	for (var key in attrs) {
		str += ` ${key}="${attrs[key]}"`;
	}
	return `<${name}${str}>`;
};

const _isEmpty = function(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) return false;
	}
	return true;
};

const cssPath = function(templateId,jsonml){
	var rules = [];
	var _cssPath = function(tplId,json){
		tplId = tplId+' > '+json[0];
		json.forEach(function(el){
			if(el.constructor === Object && el.el)
				tplId += '[el="'+el.el+'"]';
			if(el.constructor === Array)
				_cssPath(tplId,el);
		});
		if(rules.indexOf(tplId)==-1)
			rules.push(tplId);
	};
	_cssPath(templateId,jsonml);
	rules.push(templateId);
	return rules.reverse().join(' {}\n\n')+' {}\n';
};

const _jsonml = function(sourcesFolder,file,content,junk) {
	var nodeStack = [];
	var root;
	var node;
	var noStrip = false;
	var partial = '';
	var parser = new Parser(encode);

	parser.on('startElement', function(name, attrs) {
		var newNode = [ name ];

		if(name=="nm-code")
			noStrip = true;

		if(partial) {
			node.push(partial);
			partial = '';
		}

		if(!_isEmpty(attrs))
			newNode.push(attrs);

		if(node) {
			node.push(newNode);
			nodeStack.push(node);
		}

		node = newNode;
	});

	parser.on('endElement', function(name) {
		if(name=="nm-code")
			noStrip = false;
		if(partial) {
			node.push(partial);
			partial = '';
		}
		if(nodeStack.length === 0)
			root = node;
		node = nodeStack.pop();
	});

	parser.on('text', function(text) {
		var textContent = (noStrip) ? text : text.replace(/[\r\n\t]*/, "");
		if (textContent.length > 0) {
			if (partial) {
				partial += textContent;
			} else {
				partial = textContent;
			}
		}
	});

	var errorMsg = function(error,c){
		logger.msg([{b_red:'Error: '},{blue:file.substring(sourcesFolder.length+1)},{b_green:' '+error}]);
		return [
			"div",{"style": "border:1px solid black;"},
			[
				"h1",{"style": "color:red;background:pink;"},
				error
			],
			[
				"pre",{"style": "color:black;text-align: left;tab-size: 2;padding: 12px;margin:10px;"},
				c
			]
		];
	};

	if (!parser.parse(new Buffer(content, encode), true)) {
		var error = parser.getError();
		if(error=='junk after document element' && junk===undefined){
			return _jsonml(sourcesFolder,file,'<div>'+content+'</div>',true);
		} else {
			return errorMsg(error,content);
		}
	}
	return root;
};

const _parse = function(sourcesFolder, file, content, nojsonml, toSource){
	var fileName = path.basename(file, '.tpl');
	var templates = {};
	var parser = new Parser(encode);
	var stringXML = '';
	var elementCode = null;
	var templateLevel = 0;
	var templateId = null;

	parser.on('startElement', function(name, attrs) {
		if(name=='template' && !templateId){
			if(attrs.id){
				templateId = attrs.id;
				delete attrs.id;
				templates[templateId] = attrs;
			}
		} else if(name=='template'){
			templateLevel++;
		} else if(name!='nm----root'){
			if(name=='nm-code'){
				elementCode = attrs;
			}
			stringXML += _elementString(name, attrs);
		}
	});

	parser.on('endElement', function(name) {
		if(name=='template' && templateLevel===0 && templateId){

			if(nojsonml){
				templates[templateId].content = stringXML;
			} else {
				templates[templateId].content = _jsonml(sourcesFolder, file, stringXML);
				if(fileName==templateId)
					templates[templateId].rules = cssPath(templateId,templates[templateId].content);
				if(toSource){
					templates[templateId].content = JSON.stringify(templates[templateId].content);
				}
			}
			templateId = null;
			stringXML = '';
		} else if(name=='template' && emplateLevel>=0){
			templateLevel--;
		} else if(name!='nm----root'){
			if(name=='nm-code'){
				elementCode = null;
			}
			stringXML += `</${name}>`;
		}
	});

	parser.on('text', function(text) {
		if(elementCode && elementCode.language){
			stringXML += hljs.highlight(
				elementCode.language,
				text.replace(/\t/gm,'  ')).value.replace(/\$/g,'<span>&#36;</span>');
		} else {
			stringXML += text.replace(/[\r\n\t]*/, "");
		}
	});

	if (!parser.parse(new Buffer(content, encode), true)) {
		var error = parser.getError();
		logger.msg([{b_red:'Error: '},{blue:file.substring(sourcesFolder.length+1)},{b_green:' '+error}]);
	}

	return templates;
};


module.exports = function(sourcesFolder, file, content, nojsonml, toSource){
	return _parse(sourcesFolder,file,`<nm----root>${content}</nm----root>`, nojsonml, toSource);
};
