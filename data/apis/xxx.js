module.exports = {

	// url pour window.NMICRO_WEB_SERVER_URL = 'http://...'; défini dans setting.js
	url : 'NMICRO_WEB_SERVER_URL',

	// schema route
	schema : {
		// route name
		testRoute : {
			// requeste
			req :{
				// method get,post,put,del
				method : 'post',
				// prepare URL (method GET)
				// prepare : function(data){
				// 	return '/url/xxx';
				// },

				// responseType
				// responseType : 'blob',

				// headers
				// headers : [{name:'accept-version',value:"~2"}],

				// ajout automatique du JSON Web Token (header Authorization)
				// setJWT : true

				// Sauvegarde automatique du JWT envoyé, le nom de la clé retourné à la valeur de getJWT (ici : JWT)
				// getJWT : 'JWT'

			},
			// Responses
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

	// default responses
	res : {
		http_error : function(code,data){
			console.log(code,data);
		},
		http_400 : function(code,data){
			console.log(code,data,LC.api.web.BadRequestError);
		},
		http_404 : function(code,data){
			console.log(code,data,LC.api.web.NotFoundError);
		}
	}
};
