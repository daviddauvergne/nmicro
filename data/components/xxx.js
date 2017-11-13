// xxx.js
/*
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
*/
module.exports = {

/*
## Private
```javascript
	private: {
		foo: function(){},// access to the function ➔ private.foo()
		bar: 0 // access to property ➔ private.bar
	},
```
*/
	private: {},
/*
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
*/
	dom: {},
/*
## Methods
```javascript
	methods: {
		foo: function(){},
		// a global method start with the $ character
		$bar: function(){}
	},
```
*/
	methods: {},
/*
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
*/
	events: {},
/*
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
*/
/*
## Initiation properties
```javascript
	properties: {
		foo : 0,
		// a global property start with the $ character
		$bar : 0,
	}
```
*/
	properties: {}
};

/*
# Component properties

## this.els

## this.locale

## this.data

## this.attrs

*/
