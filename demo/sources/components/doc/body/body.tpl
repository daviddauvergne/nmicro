<!--
	id : nom du composant
-->
<template id="body" overlay="head" position="afterend">
	<div>---------- <foo el="bar">Click</foo> ---- xcvxcv ----</div>
</template>

<template id="dialog_alert" overlay="body" position="afterend">
	<nm-dialog mode="alert">
		<dialog-alert el="dia_alert"></dialog-alert>
	</nm-dialog>
</template>

<template id="dialog_confirm" overlay="body" position="afterend">
	<nm-dialog mode="simple">
		<dialog-confirm el="dia_confirm"></dialog-confirm>
	</nm-dialog>
</template>
