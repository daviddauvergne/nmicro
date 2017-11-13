
<template id="dialog-confirm">
		<h1>[$title]</h1>
		<p>[$message]</p>
		<br/><br/>
		<div>
			<button el="cancel">{$cancel}</button>
			<button el="ok" on-click="[$confirm]">{$ok}</button>
		</div>
</template>
