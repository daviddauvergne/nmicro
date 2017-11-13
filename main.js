
const pjson = require('./package.json');
const logger = require('./lib/logger');
const getJS = require('./lib/getjs');
const path = require('path');
const fs = require('fs-extra');
const dirnode = require('node-dir');
const md5File = require('md5-file');
const crypto = require('crypto');
const sizeOf = require('image-size');

logger.msg([{b_blue:pjson.name}],true);
logger.msg([{b_blue:'VERSION: '+pjson.version}]);
console.log('');

// -------------------------------------------------------------------

const argv = require('yargs')
	.usage('Usage: $0 /path/to/directory [options]')
	.example(`# Development mode
		$0 /path/to/directory

		# Production mode
		$0 /path/to/directory -p
		`)
	.command( "DIR", pjson.name+" project directory", { alias: "dir" } )
	.required( 1, logger.msg([{b_red:"DIR is required\n"}],false,true))

	.alias('p', 'prod')
	.describe('p', 'Production mode')
	.default('p',false)

	.alias('t', 'test')
	.describe('t', 'Test mode')
	.default('t',false)

	.check(function (argv) {
		var dir = path.join(path.resolve(argv._[0]));
		if (fs.existsSync(dir)) {
			return true;
		} else {
			throw(new Error(logger.msg([{b_red:"Invalid DIR, path: "+dir+" does not exist\n"}],false,true)));
		}
	})

	.alias('h', 'help')
	.help('help')
	.locale('en')
	.argv;

// -------------------------------------------------------------------
// start server

var dev = true;
var devString = 'dev';
process.env.TESTMODE = 'false';

if(argv.prod){
	dev = false;
	devString = 'prod';
	logger.msg([{b_red:'Production mode !!'}]);
} else {
	if(argv.test){
		process.env.TESTMODE = 'true';
		logger.msg([{yellow:'Test mode !!'}]);
	} else {
		logger.msg([{b_blue:'Devellopement mode'}]);
	}
}

var dir = path.resolve(argv._[0]);
var _conf = {
	name : path.basename(dir),
	langues : ['en'],
	defaultTheme : 'default',
	modes : ['app','web'],
	defaultMode : 'web',
	serverPort : 8080,
	serverIP : '127.0.0.1',
	dir : dir,
	logFolder : path.join(__dirname,'log'),
	sources : path.join(dir,'sources'),
	sourcesLib : path.join(dir,'sources','lib'),
	sourcesApis : path.join(dir,'sources','apis'),
	sourcesCp : path.join(dir,'sources','components'),
	sourcesThemes : path.join(dir,'sources','themes'),
	sourcesPages : path.join(dir,'sources','pages'),
	sourcesRest : path.join(dir,'sources','rest'),
	sourcesSchemas : path.join(dir,'sources','schemas'),
	dataFolder : path.join(__dirname,'data'),
	setting : '',
	dev : dev,
	appcache : false,
	manifest : false,
	devString : devString,
	outFolder : path.join(dir,'out','/'),
	indexFileHTML : 'index.html',
	mainFileJS : 'main.js',
	mainFileCSS : 'main.css',
	varsSCSS : 'vars.scss'
};

global.LC = {
	cpmain: {}
};

var nmicroClientFile = path.join(dir,'nmicro.js');
if(fs.existsSync(nmicroClientFile)){
	var _locConf = require(nmicroClientFile);
	for (var key in _locConf) {
		_conf[key] = _locConf[key];
	}
}

process.env.SERVERPORT = _conf.serverPort;
process.env.LOG_FOLDER = _conf.logFolder;

logger.msg([{b_black:'Initialization project: '+dir}]);

fs.ensureDirSync(_conf.sourcesLib);
// fs.ensureDirSync(_conf.sourcesBdl);
fs.ensureDirSync(_conf.sourcesApis);
// fs.ensureDirSync(_conf.sourcesModules);
fs.ensureDirSync(_conf.sourcesThemes);
fs.ensureDirSync(_conf.sourcesCp);
fs.ensureDirSync(_conf.sourcesRest);
fs.ensureDirSync(_conf.sourcesPages);

const webConfig = require('./lib/webConfig')(pjson,_conf);

if(!fs.existsSync(path.join(_conf.sourcesThemes,'default'))){
	webConfig.createThemeDefault(_conf);
}

_conf.settingFile = path.join(_conf.sources,'setting.js');

if(!fs.existsSync(_conf.settingFile)){
	fs.copySync(path.join(_conf.dataFolder,'setting.js'), _conf.settingFile);
}
if(!fs.existsSync(nmicroClientFile)){
	fs.copySync(path.join(_conf.dataFolder,'nmicro.js'), nmicroClientFile);
}

setTimeout(function () {
	_conf.themes = fs.readdirSync(_conf.sourcesThemes);
	_conf.pages = fs.readdirSync(_conf.sourcesPages);

	const compilThemes = require('./lib/all-compil-themes');
	const goodUrl = require('./lib/goodUrl');
	_conf.goodUrl = goodUrl(devString);

	const toWatch = require('./lib/watch');
	const restify = require('restify');
	const server = restify.createServer();
	server.use(restify.CORS());
	server.use(restify.bodyParser());
	server.get('/', webConfig.home);
	server.post('/nmicro/create', webConfig.create);
	server.post('/nmicro/del', webConfig.del);

	_conf.defaultLangue = _conf.langues[0];

	var staticDir = path.join(_conf.outFolder,_conf.defaultMode,_conf.defaultTheme,_conf.defaultLangue,'/');
	if(_conf.defaultMode=='web'){
		server.get(/\/?\.*/, restify.serveStatic({
			directory: staticDir,
			default: 'index.html'
		}));
	}

	const io = require('socket.io')(server.server);

	server.listen(_conf.serverPort, _conf.serverIP, function() {
		logger.msg([{b_black:'Listening at '+server.url}]);
		if(_conf.defaultMode=='web')
			logger.msg([{b_black:'Static server: '+staticDir}]);
	});

	const getMode = require('./lib/mode');
	var modeDefault = getMode(_conf.defaultMode);

	const compilLibDefault = require('./lib/lib-default-compil');
	compilLibDefault.getLibString(_conf,path.join(__dirname,'lib-default'),function(jsSetting){
		_conf.setting = jsSetting;

	global.getSource = function(file){
		var parseFile = path.parse(file);
		if(parseFile.ext==='')
			file += '.js';
		return getJS(path.join(_conf.sources,file),_conf);
	};
	var final = function(){
		if(_conf.manifest){
			_conf.themes.forEach(function(theme){
				var pathTheme = path.join(_conf.sourcesThemes,theme,'manifest');
				dirnode.files(pathTheme, function(err, files) {
					if(files){
						_conf.manifest.icons = [];
						files.forEach(function(file){
							var filePath = path.parse(file);
							var fileExtention = filePath.ext.toLowerCase().substring(1);
							if(fileExtention==='png'){
								var dimensions = sizeOf(file);
								var fileNewName = _conf.goodUrl.url('web','mnf_'+dimensions.width+'X'+dimensions.height+'.png');
								_conf.manifest.icons.push({
									"src": "medias/icons/"+fileNewName,
									"sizes": dimensions.width+"x"+dimensions.height,
									"type": "image/png"
								});
								_conf.langues.forEach(function(lang){
									var fileNewPath = path.join(_conf.outFolder,'web',theme,lang,'medias','icons',fileNewName);
									fs.copySync(file, fileNewPath);
								});
							}
						});
						_conf.langues.forEach(function(lang){
							fs.outputFileSync(path.join(_conf.outFolder,'web',theme,lang,'manifest.json'), JSON.stringify(_conf.manifest));
						});
						logger.msg([{yellow:'Manifest finish'}]);
					}
				});
			});
		}
		var loopLength = _conf.themes.length*_conf.langues.length;
		var count = 0;
		var finatPut = function(){
			if(_conf.appcache){
				count++;
				if(count==loopLength){
					logger.msg([{yellow:'Appcache finish'}]);
					logger.msg([{yellow:'Compil finish'}]);
				}
			} else {
				logger.msg([{yellow:'Compil finish'}]);
			}
		};
		if(_conf.appcache){
			_conf.themes.forEach(function(theme){
				_conf.langues.forEach(function(lang){
					var pathWML = path.join(_conf.outFolder,'web',theme,lang);
					dirnode.files(pathWML, function(err, files) {
						if (err) throw err;
						var hashFiles = '';
						var filesRelative = files.map(function(file){
							hashFiles += md5File.sync(file);
							return file.substring(pathWML.length+1);
						});
						var filesSting = filesRelative.join("\n");
						var hash = crypto.createHash('md5').update(hashFiles).digest('hex');
						var date = new Date().toUTCString();
						var manifestStr = `CACHE MANIFEST

CACHE:
${filesSting}

FALLBACK:
/ /index.html

NETWORK:
*

# ${hash}
# ${date}
`;
							fs.outputFile(path.join(pathWML,_conf.appcache), manifestStr, function (err) {
								if (err) return console.error(err);
								finatPut();
							});
						});
					});
				});
			} else {
				finatPut();
			}
		};
		server.post('/nmicro/compilall', function(req, res, next) {
			_conf.themes = fs.readdirSync(_conf.sourcesThemes);
			_conf.pages = fs.readdirSync(_conf.sourcesPages);
			compilThemes(_conf,emitMessage,function(){
				final();
			});
			res.send('ok');
			return next();
		});
		var emitMessage = function(name){
			if(socket)
				socket.emit('message', { content: name, importance: '1' });
		};
		compilThemes(_conf,emitMessage,function(){
			final();
		});
		var socket = null;
		var watcher = toWatch(_conf,modeDefault,logger,server,emitMessage);
		watcher.start();
		webConfig.pushStalker(watcher);
		io.sockets.on('connection', function (__socket) {
			socket = __socket;
			socket.on('console', function (data) {
				if(data.type=='onerror'){
					var url = data.arguments[1];
					var jsFile = path.join(staticDir,url.substring(server.url.length+1));
					var content = fs.readFileSync(jsFile,'utf8');
					content = content.split('\n');
					var line = (data.arguments[2]*1)-1;
					var tab = content[line].match(/\[(\d+)\|(.*)\.js\]/);
					if(tab){
						logger.onerror(data.arguments[0],tab[2]+'.js',tab[1]);
					} else {
						logger.onerror(data.arguments[0],data.arguments[1],data.arguments[2]);
					}
				} else {
					logger[data.type](Object.values(data.arguments));
				}
			});
		});
		logger.init();

	});
}, 200);
