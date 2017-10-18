<!--
	Attribut du template :
		id : nom du composant
-->
<template id="xxx">
	<div>{$clickme}</div>
</template>

<!--
	Les fichiers .tpl peuvent contenir plusieurs templates.
	Ces templates doivent avoir un identifiant différent du nom du composant.
	Le rendu ne se fait pas automatiquement, il se déclenche avec  la fonction 'rend' :

		this.rend("identifiant_du_template");

	Attributs du template :
		id : identifiant du template
		overlay : élément de réference pour l'insertion
			- soit le nom d'un élément dans le template du composant (*)
			- soit un selecteur CSS
		position : mode d'insertion dans le DOM
			- 'beforebegin' -<p>- 'afterbegin' - 'beforeend' -</p>- 'afterend', et 'replace'

______
	* Nom d'un élément

	Pour nommer un élément d'un composant on utilise l'arribut "el"

			<xx el="element_name">...</xx>

	L'élément est accesible en JS via l'object "els" du composant

			this.els.element_name <=> <xx el="element_name">...</xx>

-->
