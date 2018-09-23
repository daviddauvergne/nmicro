// NMICRO configuration
module.exports = {
	// version
	version: '1.0',

	// description
	description: 'Appli description',

	// // Log folder mode "test" default: ./log
	// logFolder: '/path/to/log',

	// language lists
	// default language is the first in the list
	langues: ['fr', 'en'],

	// only recompiled theme when changing file
	defaultTheme: 'default',

	// only recompiled mode when changing files (web or app)
	defaultMode: 'web',

	// Out folder (absolute path)
	// outFolder : '/path/out/project/',

	// appcache
	// appcache: 'appname.appcache',

	// manifest
	// manifest: {
	// 	"name": "Application name",
	// 	"short_name": "ApplicationName",
	// 	"start_url": "index.html",
	// 	"display": "standalone"
	// },

	// server IP
	serverIP: '127.0.0.1',

	// server port
	serverPort: 8080
};
