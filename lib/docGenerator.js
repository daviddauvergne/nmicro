const extract = require('multilang-extract-comments');
const fs = require('fs');
const path = require('path');

var parse = function(file,options){
	var content = '';
	var string = fs.readFileSync(file, 'utf8');
	var comments = extract(string,options);
	for (var comment in comments) {
		var type = comments[comment].info.type;
		if(type=='multiline')
			content += comments[comment].content;
	}
	return content;
};

var optionsTPL = {
	pattern: {
		name: 'Template',
		nameMatchers: ['.tpl'],
		// singleLineComment: [{ start: '#' }],
		multiLineComment: [{ start: '<!--', middle: '', end: '-->'}]
	}
};

var getMD = function(files){
	var contentMD = '';
	files.forEach(function(file){
		var ext = path.extname(file);
		if(ext=='.js' || ext=='.scss' || ext=='.tpl'){
			var opt;
			if(ext=='.tpl')
				opt = optionsTPL;

			contentMD += parse(file,opt);
		} else if(ext=='.md'){
			contentMD += fs.readFileSync(file, 'utf8');
		}
	});
	return contentMD;
};

module.exports = function(outfile,files,version){
	var content = 'V'+version+'\n\n'+getMD(files);
	fs.writeFile(outfile, content, 'utf8', function(err){
		if (err) throw err;
		return null;
	});
};
