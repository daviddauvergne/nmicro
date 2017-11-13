
<template id="body_rend_data" overlay="result" position="replace">
	<div on-click="[$clickevt]" title="[$title]">[$content]</div>
</template>

<template id="body_rend_data_code" overlay="code" position="replace">

<h3><samp>components/index/body/body_rend_data.tpl</samp></h3>
<nm-code language="xml"><![CDATA[<template id="body_rend_data" overlay="result" position="replace">
	<div on-click="[$clickevt]" title="[$title]">[$content]</div>
</template>
]]></nm-code>

<h3><samp>components/index/body/body.js</samp></h3>
<nm-code language="js"><![CDATA[...
this.rend('body_rend_data',{
	clickevt: function(){
		console.log('body-rend-data');
	},
	title:   LC.cp.body.dtitle,
	content: '------------- '+LC.cp.body.clickme+' -------------'
});
...]]></nm-code>
</template>
