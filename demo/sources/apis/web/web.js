module.exports = {

	// url pour window.NMICRO_WEB_SERVER_URL = 'http://xxxxx'; défini dans setting.js
	url: 'NMICRO_WEB_SERVER_URL',

	// shéma des différentes routes
	schema: {
		// nom de route
		'/test/route': {
			// requête
			req: {
				// method get,post,put,del
				method: 'post'
				// content-type
				// contentType : 'application/json',
				// prepare URL (method GET)
				// prepare : function(data){
				// 	return '/url/xxx';
				// },
				// ajout automatique du JSON Web Token (header Authorization)
				// setJWT : true
				// Sauvegarde automatique du JWT envoyé, le nom de la clé retourné à la valeur de getJWT (ici : JWT)
				// getJWT : 'JWT'
			},
			// traitement des réponses pour cette route
			// res : {
			// 	http_200 : function(data){
			// 		console.log(data);
			// 	},
			// 	http_500 : function(data){
			// 		console.log(data);
			// 	}
			// }
		}
	},

	// réponses par défault assignées à toutes les routes
	res: {
		http_error: function (code, data) {
			DIA.alert('ERROR ' + code, code.message);
		},
		http_400: function (code, data) {
			DIA.alert('ERROR 400', LC.api.web.BadRequestError);
		}
	}
};
