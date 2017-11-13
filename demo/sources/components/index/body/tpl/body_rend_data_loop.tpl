
<template id="body_rend_data_loop" overlay="result" position="beforeend">
	<div><hr/>[$content]</div>
</template>

<template id="body_rend_data_loop_code" overlay="code" position="replace">
<div>
	<h3><samp>components/index/body/body_rend_data.tpl</samp></h3>
	<nm-code language="xml"><![CDATA[<template id="body_rend_data_loop" overlay="result" position="beforeend">
		<div><hr/>[$content]</div>
	</template>
	]]></nm-code>

	<h3><samp>components/index/body/body.js</samp></h3>
	<nm-code language="js"><![CDATA[...
	this.els.result.innerHTML = '';
	this.rend('body_rend_data_loop',[
		{content: 'xxxxxxxxxxxxxxxxxxxxxx'},
		{content: 'yyyyyyyyyyyyyyyyyyyyyy'},
		{content: 'zzzzzzzzzzzzzzzzzzzzzz'}
	]);
	...]]></nm-code>
</div>
</template>
