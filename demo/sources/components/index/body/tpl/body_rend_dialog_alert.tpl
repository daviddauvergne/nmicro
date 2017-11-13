
<template id="body_rend_dialog_alert" overlay="result" position="replace">
	<div>{$button.dialogAlert}</div>
</template>


<template id="body_rend_dialog_alert_code" overlay="code" position="replace">

<h3><samp>components/index/body/body.tpl</samp></h3>
<nm-code language="xml"><![CDATA[<template id="dialog_alert" overlay=":scope" position="beforeend">
	<nm-dialog mode="alert">
		<dialog-alert></dialog-alert>
	</nm-dialog>
</template>
]]></nm-code>

<h3><samp>components/index/body/body.js</samp></h3>
<nm-code language="js"><![CDATA[...
this.rend('dialog_alert',{
	'title':		LC.cp.body.dtitle,
	'message':	LC.cp.body.dmessage
});
...]]></nm-code>

<h3><samp>components/main/dialog-alert/dialog-alert.tpl</samp></h3>
<nm-code language="xml"><![CDATA[<template id="dialog-alert">
	<h1>[$title]</h1>
	<p>[$message]</p>
	<br/><br/>
	<button el="close">{$ok}</button>
</template>
]]></nm-code>

<h3><samp>components/main/dialog-alert/dialog-alert.js</samp></h3>
<nm-code language="js"><![CDATA[module.exports = {
	events : {
		click : {
			close : function(e){
				e.preventDefault();
				this.trigger('nm-dialog-close');
			}
		}
	}
};]]></nm-code>
</template>
