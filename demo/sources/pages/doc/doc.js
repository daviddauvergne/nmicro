module.exports = {

	// Page xxx
	// xxx.js

	// ------------------------------------------------------------------
	// Restriction

	// Restriction imposée, afin que la page soit présente dans un seul
	// mode de sortie 'app' or 'web'. Par défaut la page na aucune
	// restriction et donc est présente dans les deux modes de sortie.
	// Le mode est accessible en JS via : window.MODE

	// restriction : 'web',

	// liste des APIs dont dépend la page
	apis : ['web'],

	// "scenarios" est un tableau de noms de scenarios pour le développement et les tests
	// Uniquement les scenarios de cette liste seront lancés par composants
	// Les scenarios sont valides uniquement en mode normal et test
	scenarios : ['bar']
};
