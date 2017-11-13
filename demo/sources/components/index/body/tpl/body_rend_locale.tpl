
<template id="body_rend_locale" overlay="result" position="replace">
	<cp-ex-locale>XXXX -- {$button.cpexlocale} -- XXXX</cp-ex-locale>
</template>

<template id="body_rend_locale_code" overlay="code" position="replace">
<div>
	<h3><samp>components/index/rend-locale/rend-locale.tpl</samp></h3>
	<nm-code language="xml"><![CDATA[<template id="rend-locale">
		<div>
			{$txt}
		<hr/>
			{$langname}
		</div>
		<br/>
		<div>{$assignContent} <span el="content"></span></div>
	</template>
	]]></nm-code>

	<h3><samp>components/index/rend-locale/locale/en.json</samp></h3>
	<nm-code language="json"><![CDATA[{
		"txt": "Here is some text",
		"langname": "English",
		"assignContent": "Assign content:"
	}]]></nm-code>

	<h3><samp>components/index/body/body_rend_locale.tpl</samp></h3>
	<nm-code language="xml"><![CDATA[<template id="body_rend_locale" overlay="result" position="replace">
		<cp-ex-locale>XXXX -- {$button.cpexlocale} -- XXXX</cp-ex-locale>
	</template>]]></nm-code>

	<h3><samp>components/index/body/body.js</samp></h3>
	<nm-code language="js"><![CDATA[...
	this.rend('body_rend_locale');
	...]]></nm-code>
</div>
</template>
