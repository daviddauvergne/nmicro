<template id="body">
	<div el="prod">
		<header/>
		<product name="{$product} 1"/>
		<product name="{$product} 2"/>
	</div>
</template>

<template id="products" overlay="prod" position="beforeend">
	<product name="[$name]"/>
</template>
