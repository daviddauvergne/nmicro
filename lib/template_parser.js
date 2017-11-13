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
			return _jsonml(sourcesFolder,file,'<div style="display:block !important;border:5px solid red;background-image:url(\'data:image/jpeg;base64,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\');background-color:pink;min-width:100px;min-height:100px;">'+content+'</div>',true);
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
