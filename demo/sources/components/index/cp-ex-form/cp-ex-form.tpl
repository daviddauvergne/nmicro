<!--
	Template attribute :
		id : component name
-->
<template id="cp-ex-form">
	<form el="form">
		<p>
			<label>{$txt}</label>
			 <input type="text" name="str" required="required" placeholder="{$txt}"/>
		</p>

		<div>
			<button>{$ok}</button>
		</div>
	</form>
</template>
