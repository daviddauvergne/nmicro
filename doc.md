# NMICRO — présentation

## Principe

1. nmicro ➔ packager/framwork HTML, CSS, JS + medias
1. génération de plusieurs modèles (CSS [via SASS] + medias)
1. multi-langues
1. deux types de sortie (structure des dossiers):
	1. app ➔ application mobile
	1. web ➔ site web

## Fonctions

1. server HTTP
1. server REST pour des tests d'API
1. builder
1. auto-packing à l'enregistrement d'un fichier source
	1. erreur de construction dans la console
	1. socket.io:
		1. auto reload
		1. log/error du navigateur dans la console

## Architecture, modularisation

### component

![Schema NMICRO](demo/sources/themes/default/medias/nm-schema.svg)

- **+ API**
- **+ pages simples**

### Structure du dossier **sources**

## Niveau 0
- **sources**
	- **apis**
	- **components**
	- **lib**
	- **themes**
	- **rest**
	- **setting.js**
- **nmicro.js** ➔ configuration pour nmicro

## apis

- **apis** ➔ dossier pour les modules **apis**
	- **web** ➔ dossier du module *web*  (obligatoire)
		- **locale** ➔ dossier des langues
			- **en.json** ➔ ressource langue en du module *web*
			- **fr.json** ➔ ressource langue fr du module *web*
		- **web.js** ➔ ressource JS du module *web*  (obligatoire)

## components

- **components** ➔ dossier pour les components
	- **home** ➔ dossier pour la page *home*  (obligatoire)
		- **line** ➔ dossier du component *line*  (obligatoire)
			- **locale** ➔ dossier des langues
				- **en.json** ➔ ressource langue en du component *line*
				- **fr.json** ➔ ressource langue fr du component *line*
			- **line.js** ➔ ressource JS du component *line*  (obligatoire)
			- **line.scss** ➔ ressource SCSS du component *line*
			- **line.tpl** ➔ ressource template du component *line*

## lib

- **lib** ➔ dossier pour les lib
	- **util.js** -> ressource JS (scop window)
	- **timer.js** -> ressource JS (scop window)

## themes

- **themes** ➔ dossier pour les modèles
	- **default** ➔ dossier du modèle *default*  (obligatoire)
		- **medias** ➔ dossier des medias
			- **favicon.png** ➔ ressource image
			- **font.ttf** ➔ ressource fonte
		- **main.scss** ➔ ressource SCSS de base du modèle *default* (obligatoire)
		- **vars.scss** ➔ ressource SCSS des variables du modèle *default* (obligatoire)

## pages

- **pages** ➔ dossier pour les pages simple
	- **home** ➔ dossier de la page *home*  (obligatoire)
		- **locale** ➔ dossier des langues
			- **en.json** ➔ ressource langue en de la page *home*
			- **fr.json** ➔ ressource langue fr de la page *home*
		- **home.js** ➔ ressource JS de la page *home*  (obligatoire)
		- **home.scss** ➔ ressource SCSS de la page *home*
		- **home.tpl** ➔ ressource template de la page *home*  (obligatoire)

## rest

- **rest** ➔ dossier pour le serveur REST (tests)
	- **web-rest.js** ➔ ressource JS pour le serveur REST
