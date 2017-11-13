
<template id="body_rend_dialog_confirm" overlay="result" position="replace">
	<div>{$button.dialogConfirm}</div>
</template>


<template id="body_rend_dialog_confirm_code" overlay="code" position="replace">
<div>
	<h3><samp>components/index/body/body.tpl</samp></h3>
	<nm-code language="xml"><![CDATA[<template id="dialog_confirm" overlay="body" position="beforeend">
		<nm-dialog mode="simple">
			<dialog-confirm></dialog-confirm>
		</nm-dialog>
	</template>
	]]></nm-code>

	<h3><samp>components/index/body/body.js</samp></h3>
	<nm-code language="js"><![CDATA[...
	this.rend('dialog_confirm',{
		'title':		LC.cp.body.dtitle,
		'message':	LC.cp.body.dmessage,
		'confirm': 	function(e){
			e.preventDefault();
			console.log('ok confirmation !');
		}
	});
	...]]></nm-code>

	<h3><samp>components/main/dialog-confirm/dialog-confirm.tpl</samp></h3>
	<nm-code language="xml"><![CDATA[<template id="dialog-confirm">
			<h1>[$title]</h1>
			<p>[$message]</p>
			<br/><br/>
			<div>
				<button el="cancel">{$cancel}</button>
				<button el="ok" on-click="[$confirm]">{$ok}</button>
			</div>
	</templates>
	]]></nm-code>

	<h3><samp>components/main/dialog-confirm/dialog-confirm.js</samp></h3>
	<nm-code language="js"><![CDATA[module.exports = {
		private : {
			close : function(me,e){
				e.preventDefault();
				me.trigger('nm-dialog-close');
			}
		},
		// Events
		events : {
			click : {
				ok : function(e){
					private.close(this,e);
				},
				cancel : function(e){
					private.close(this,e);
				}
			}
		}
	};]]></nm-code>
</div>
</template>
