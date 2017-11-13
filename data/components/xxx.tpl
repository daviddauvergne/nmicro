<!--

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
-->

<template id="xxx">
	<div>{$clickme}</div>
</template>

<!--
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
-->
