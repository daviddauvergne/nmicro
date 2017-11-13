const dir = require('node-dir');
const path = require('path');
var er_dev = /\t*\/\/\s*<DEV>[\s\S]*?\s*<\/DEV>/gm;
var er_prod = /\t*\/\/\s*<PROD>[\s\S]*?\s*<\/PROD>/gm;

var socketDEvString = `
<script src="/socket.io/socket.io.js"></script>
<script>
var socket = io();
socket.on('message', function(message) {
	var basename = window.location.pathname.substring(1).split('.');
	if(basename[0]==message.content || message.content=='_all_')
	location.reload();
});

var consoleHolder = console;

console = function(typec,type,args){
	consoleHolder[typec].apply(console,args);
	if(args && args[0] && args[0].replace){
		args[0] = "\x1b[1m\x1b[30m"+args[0].replace(/%c/g,'')+"\x1b[0m";
		delete args[1];
	}
	socket.emit('console', { type: type, arguments: args});
};

console.log = function(){this('log','log',arguments);};
console.info = function(){this('info','info',arguments);};
console.debug = function(){this('log','debug',arguments);};
console.warn = function(){this('warn','warn',arguments);};
console.error = function(){this('error','error',arguments);};

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	socket.emit('console', { type: 'onerror', arguments: [errorMsg, url, lineNumber, column, errorObj]});
}
window.addEventListener('error', function(e) {
	if(e.constructor.name!="ErrorEvent"){
		if(e.srcElement && e.srcElement.src){
			socket.emit('console', { type: 'error', arguments: [e.srcElement.src,'404 No found']});
		}
		if(e.srcElement && e.srcElement.href){
			socket.emit('console', { type: 'error', arguments: [e.srcElement.href,'404 No found']});
		}
	}
}, true);
</script>
`;

var loggProdString = `
<script>
var consoleHolder = console;
console = {
	log: function(){},
	info: function(){},
	debug: function(){},
	warn: function(){},
	error: function(){consoleHolder.error.apply(console,arguments);},
};
</script>
`;

module.exports = {
	getSocketDEvString : function(){
		return socketDEvString;
	},
	getLoggProdString : function(){
		return loggProdString;
	},
	getLibString : function(config,folder,callback){
		var libString = '';
		var erg;
		if(config.dev){
			erg = er_prod;
		} else {
			erg = er_dev;
		}

		dir.readFiles(folder,
			function(err, content, filename, next) {
				var parseFile = path.parse(filename);
				if(parseFile.ext=='.js'){
					if(config.dev){
						var nameFile = filename.substring(config.sources.length);
						var cl = 0;
						content = content.replace(/(\n)/gm,function(){
							cl++;
							return `//[${cl}|${nameFile}]\n`;
						});
						libString += content.replace(erg,"");
					} else {
						if(parseFile.name!="simulant")
							libString += content.replace(erg,"");
					}
				}
				next();
			},
			function(err, files){
				if (err) {
					console.log(err);
					return callback(null);
				}
				return callback(libString);
			}
		);
	}
};
