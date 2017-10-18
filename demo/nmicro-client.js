
// options pour NMICRO
module.exports = {
	// Log folder mode "test" default: ./log
	// logFolder: '/path/to/log',

	// Out folder (absolute path)
	outFolder : '/var/www/temp/nm/',
	// listes des langues
	// langue par défaut est la première de la liste
	langues : ['fr','en'],
	// seul modèle recompilé lors d'un changement de fichiers
	defaultTheme : 'default',
	// seul mode recompilé lors d'un changement de fichiers (web or app)
	defaultMode : 'web',
	// Port du serveur de test
	serverPort : 8080,
	// IP du serveur de test
	serverIP : '127.0.0.1'
};
