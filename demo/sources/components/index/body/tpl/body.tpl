<!--
	Template attribute :
		id : component name
-->
<template id="body">
<div>
	<h1>{$title}</h1>
	<h2>{$openconsole}</h2>
	<div el="toolbar">

		<button el="rendData">{$button.rendData}</button>
		<button el="rendDataLoop">{$button.rendDataLoop}</button>

		<button el="cpExLocale">{$button.cpexlocale}</button>
		<button el="cpExData">{$button.cpexdata}</button>

		<button el="dialogAlert">{$button.dialogAlert}</button>
		<button el="dialogConfirm">{$button.dialogConfirm}</button>

		<button el="api">{$button.api}</button>
	</div>

	<div class="tabbox">
		<nm-tabbox>
			<nm-tabs>
				<nm-tab>{$tab.result}</nm-tab>
				<nm-tab>{$tab.code}</nm-tab>
			</nm-tabs>

			<nm-tabpanels>
				<nm-tabpanel el="result"></nm-tabpanel>
				<nm-tabpanel el="code"></nm-tabpanel>
			</nm-tabpanels>
		</nm-tabbox>
	</div>
</div>
</template>

<!--
	Multi-templating

	Template attribute :
		id: template name (different from the component name)
		overlay: reference element for insertion
				- the name of an element in the template component (ex: <xx el="element_name">...</xx>)
				- CSS selector
				- or ":scope" for component itself
		position: insert mode in the DOM
			- 'beforebegin' -<p>- 'afterbegin' - 'beforeend' -</p>- 'afterend', and 'replace

	ex: <template id="tpl_name" overlay="body" position="beforeend">

	The locale is written with braces and the sign $:

	<div>{$txt}</div>
	<div>{$foo.bar}</div>

	The data is written with square brackets and the sign $:

	<div on-click="[$event]" to-action="[$action]" title="[$attribute]">[$content]</div>

	[$event] => click event (is function)
	[$action] => action method (is function)
	[$attribute] => string attribute
	[$content] => string content (with or without valid XML elements)
-->
<template id="dialog_alert" overlay=":scope" position="beforeend">
	<nm-dialog mode="alert">
		<dialog-alert></dialog-alert>
	</nm-dialog>
</template>

<template id="dialog_confirm" overlay="body" position="beforeend">
	<nm-dialog mode="simple">
		<dialog-confirm></dialog-confirm>
	</nm-dialog>
</template>
