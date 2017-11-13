const fs = require('fs');
const tplParser = require('./template_parser');

module.exports = function(sourcesFolder,file,callback,nojsonml,toSource){
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) {
			// log error
			return callback(null);
		}
		callback(tplParser(sourcesFolder, file, data, nojsonml, toSource));
	});
};
