
<template id="body_cpExData_code" overlay="code" position="replace">

<h3><samp>demo/sources/components/index/cp-ex-data/cp-ex-data.tpl</samp></h3>
<nm-code language="xml"><![CDATA[<template id="cp-ex-data">
	<div>→ [$value]</div>
</template>
]]></nm-code>

<h3><samp>components/index/body/body.js</samp></h3>
<nm-code language="js"><![CDATA[module.exports = {
	attributes: {
		color: {
			set: function(val){
				this._color = val;
				this.style.color = val;
			},
			get: function(){
				return this._color;
			}
		}
	}
};]]></nm-code>

<h3><samp>components/index/body/body.js</samp></h3>
<nm-code language="js"><![CDATA[...
this.rend({
	overlay:  "result",
	position: "replace",
	template: [ "cp-ex-data",{ color:"blue" } ]
},{value:LC.cp.body.dmessage});
...]]></nm-code>
</template>
