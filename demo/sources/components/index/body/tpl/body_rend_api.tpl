
<template id="body_rend_api_form" overlay="result" position="replace">
	<cp-ex-form to-callback="[$callback]"></cp-ex-form>
</template>

<template id="body_rend_api" overlay="result" position="replace">
<div>
	<div>email: [$email]</div>
	<div>firstname: [$firstname]</div>
	<div>lastname: [$lastname]</div>
	<div>str: [$str]</div>
</div>
</template>

<template id="body_rend_api_code" overlay="code" position="replace">
<div>
	<h3><samp>components/index/body/body_rend_api.tpl</samp></h3>
	<nm-code language="xml"><![CDATA[<template id="body_rend_api_form" overlay="result" position="replace">
		<cp-ex-form to-callback="[$callback]"></cp-ex-form>
	</template>

	<template id="body_rend_api" overlay="result" position="replace">
		<div>email: [$email]</div>
		<div>firstname: [$firstname]</div>
		<div>lastname: [$lastname]</div>
		<div>str: [$str]</div>
	</template>]]></nm-code>

	<h3><samp>components/index/body/body.js</samp></h3>
	<nm-code language="js"><![CDATA[...
	var me = this;
	this.rend('body_rend_api_form',{callback:function(data){
		me.rend('body_rend_api',data);
	}});
	...]]></nm-code>


	<h3><samp>components/index/cp-ex-form/cp-ex-form.tpl</samp></h3>
	<nm-code language="xml"><![CDATA[<template id="cp-ex-form">
		<form el="form">
			<p>
				<label>{$txt}</label>
				 <input type="text" name="str" required="required" placeholder="{$txt}"/>
			</p>

			<div>
				<button>{$ok}</button>
			</div>
		</form>
	</template>]]></nm-code>

	<h3><samp>components/index/cp-ex-form/cp-ex-form.js</samp></h3>
	<nm-code language="js"><![CDATA[module.exports = {
		events: {
			submit: {
				form: function(e){
					e.preventDefault();
					if(this.els.form.checkValidity()){
						var data = new FormData(this.els.form);
						this.api('web','testRoute',{
							data : data,
							res : {
								http_200 : function(data){
									console.log('Server response:',data);
									this.callback(data);
								}
							}
						});
					}
				}
			}
		}
	};]]></nm-code>
</div>
</template>
