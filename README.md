# NMICRO

## Install
```bash
$ git clone https://github.com/daviddauvergne/nmicro.git
$ cd nmicro/
$ npm install
```
## Help
```bash
$ cd /path/to/nmicro/
$ node main.js --help
```

## Start test
```bash
$ cd /path/to/nmicro/
$ node main.js /path/to/project --test
```
OR
```bash
$ cd /path/to/nmicro/
$ node main.js /path/to/project -t
```

## Start prod
```bash
$ cd /path/to/nmicro/
$ node main.js /path/to/project --prod
```
OR
```bash
$ cd /path/to/nmicro/
$ node main.js /path/to/project -p
```

## Start demo
```bash
$ cd /path/to/nmicro/
$ node main.js ./demo
```
In your browser: http://localhost:8080

## Create documentation
```bash
$ cd /path/to/nmicro/
$ node doc.js
```

## Principle

1. nmicro ➔ packager/framwork HTML, CSS, JS + media
1. Progressive web app
1. generation of several themes (CSS [by SASS] + media)
1. multilanguage
1. two types of output (folder structure):
	1. app ➔ mobile app
	1. web ➔ website
1. very easy to use!!!

## Fonctions

1. server HTTP
1. server REST for test (API)
1. builder
1. auto-packing when saving a source file
	1. build error in the console
	1. socket.io:
	1. auto reload
	1. log/error of the browser in the console

## Architecture, modularization

```bash
sources
|  └─ apis
|      └─ api_name
|          └─ locale
|              └─ en.json
|              └─ fr.json
|          └─ api_name.js
|  └─ components
|      └─ page_name
|          └─ component_name
|              └─ locale
|                  └─ en.json
|                  └─ fr.json
|              └─ component_name.js
|              └─ component_name.scss
|              └─ component_name.tpl
|  └─ lib
|      └─ util.js
|  └─ pages
|      └─ page_name
|          └─ locale
|              └─ en.json
|              └─ fr.json
|          └─ page_name.js
|          └─ page_name.scss
|          └─ page_name.tpl
|  └─ rest
|      └─ api_name-rest.js
|  └─ schemas
|      └─ api_name
|          └─ 404.json
|          └─ route.json
|  └─ themes
|      └─ default
|          └─ medias
|              └─ favicon.ico
|              └─ favicon.png
|          └─ main.scss
|          └─ vars.scss
|  └─ setting.js ➔ configuration for nmicro
```
