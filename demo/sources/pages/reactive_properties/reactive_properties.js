module.exports = {

	// Page reactive_properties
	// reactive_properties.js

	// ------------------------------------------------------------------
	// Restriction

	// Restriction imposée, afin que la page soit présente dans un seul
	// mode de sortie 'app' ou bien 'web'. Par défaut la page na aucune
	// restriction et donc est présente dans les deux modes de sortie.
	// Le mode est accessible en JS via : window.MODE

	// restriction : 'web',

	// liste des APIs dont dépend la page
	apis: [],

	// "scenarios" est un tableau de noms de scenarios pour le développement et les tests
	// Seul les scenarios de cette liste seront lancés par les composants
	// Les scenarios sont présents uniquement en dévelloppement, ils sont retirés en production
	scenarios: []
};
