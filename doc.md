V1.0.0

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
# Component Javascript

## Folder structure

Default structure
```bash
component_name
|  └─ locale
|      └─ en.json
|      └─ fr.json
|  └─ component_name.js
|  └─ component_name.scss
|  └─ component_name.tpl
```

You can change the structure, the files will be added automatically

Example:
```bash
component_name
|  └─ locale
|      └─ en.json
|      └─ fr.json
|  └─ js
|      └─ component_name.js
|      └─ events.js
|  └─ scss
|      └─ component_name.scss
|      └─ dialog_template.scss
|  └─ tpl
|      └─ component_name.tpl
|      └─ dialog_template.tpl
```

## Get external source

```javascript
var inport = global.getSource('/directory/file');// sources/directory/file.js
```
## Private
```javascript
	private: {
		foo: function(){},// access to the function ➔ private.foo()
		bar: 0 // access to property ➔ private.bar
	},
```
## DOM actions
```javascript
	dom: {
		// when the element is created
		create: function(){},
		// when the element is inserted
		insert: function(){},
		// when the element is deleted
		remove: function(){},
		// when content is inserted in the element
		contentInsert: function(){},
	},
```
## Methods
```javascript
	methods: {
		foo: function(){},
		// a global method start with the $ character
		$bar: function(){}
	},
```
## Events

### Component event
```javascript
	events: {
		click: function(e){}
	},
```
### Component delegation event
```javascript
	events: {
		click: {
			// <xx el="foo">...</xx> in the component template
			foo: function(e){}
		}
	},
```
## Attributes
```javascript
	attributes: {
		value: {
			set: function(val){
				this._value = val;
			},
			get: function(){
				return this._value;
			}
		}
	},
```
## Initiation properties
```javascript
	properties: {
		foo : 0,
		// a global property start with the $ character
		$bar : 0,
	}
```
# Component properties

## this.els

## this.locale

## this.data

## this.attrs

# Component methods

## api(name, route, data)

| Param | Type     | Description | Required |
|-------|----------|-------------| -------- |
| name  | `string` | API name    | Yes      |
| route | `string` | route name  | Yes      |
| data  | `object` | sent data   | No       |

```javascript
if(this.els.form.checkValidity()){
	var data = new FormData(this.els.form);
	this.api('web','/test/route',{
		data : data,
		res : {
			http_200 : function(data){
				...
			},
			http_500 : function(data){
				 ...
			}
		}
	});
}
```
## dispatchChildrens(methodName, stopPropagation, data, max)

| Param            | Type      | Description                                       | Required |
|------------------|-----------|---------------------------------------------------| -------- |
| methodName       | `string`  | method name                                       | Yes      |
| stopPropagation  | `boolean` | stop propagation to the first method encountered  | Yes      |
| data             | `object`  | sent data                                         | No       |
| max              | `integer` | maximum level of depth                            | No       |

## dispatchMethods(props)

| Param  | Type                | Description           | Required |
|--------|---------------------|-----------------------| -------- |
| props  | `string` or `array` | properties to dispath | Yes      |

## dispatchParents(methodName, stopPropagation, data, max)

| Param            | Type      | Description                                       | Required |
|------------------|-----------|---------------------------------------------------| -------- |
| methodName       | `string`  | method name                                       | Yes      |
| stopPropagation  | `boolean` | stop propagation to the first method encountered  | Yes      |
| data             | `object`  | sent data                                         | No       |
| max              | `integer` | maximum level of depth                            | No       |

## getProperties(props)

| Param  | Type                | Description       | Required |
|--------|---------------------|-------------------| -------- |
| props  | `string` or `array` | properties to get | Yes      |

## rend(tplName,data)

| Param    | Type     | Description   | Required |
|----------|----------|---------------| -------- |
| tplName  | `string` | template name | Yes      |
| data     | `object` | sent data     | No       |

```javascript
this.rend('tplName',{
	key! 'value'
});
```
## trigger(eventName, data)

| Param      | Type     | Description   | Required |
|------------|----------|---------------| -------- |
| eventName  | `string` | event name    | Yes      |
| data       | `mixed`  | sent data     | No       |

```javascript
this.trigger('eventName',12);
```
# Component template

```xml
<template id="component_name">
	...
</template>
```

## Template attribute

 - id : component name

### The locale is written with braces and the sign $:

```xml
<div>{$txt}</div>
<div>{$foo.bar}</div>
```

### To display a property or attribute in an element

```xml
<span property="property_name"/>
<span attribute="attribute_name"/>
```
# Multi-templating

## Template attribute :

- id: template name (different from the component name)
- overlay: reference element for insertion
	- the name of an element in the template component (ex: `<xx el="element_name">...</xx>`)
	- CSS selector
	- or `:scope` for component itself
- position: insert mode in the DOM
	- beforebegin `<p>` afterbegin - beforeend `</p>` afterend, and replace

```xml
<template id="tpl_name" overlay="body" position="beforeend">
	...
</template>
```

### The locale is written with braces and the sign $:

```xml
<div>{$txt}</div>
<div>{$foo.bar}</div>
```

### To display a property or attribute in an element

```xml
<span property="property_name"/>
<span attribute="attribute_name"/>
```

### The data is written with square brackets and the sign $:

```xml
<div on-click="[$event]" to-action="[$action]" title="[$attribute]">
	[$content]
</div>
```
- `[$event]    ` ➔ click event (is function)
- `[$action]   ` ➔ action method (is function)
- `[$attribute]` ➔ string attribute
- `[$content]  ` ➔ string content (with or without valid XML elements)

### Data render

```javascript
this.rend('template_name',data); // the data are optional
```
