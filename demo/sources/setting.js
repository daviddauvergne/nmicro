
module.exports = {
	default : {// theme
		app : {// out app
			dev : {// mode dev
				NMICRO_WEB_SERVER_URL : 'http://localhost:8080/',
				languesName: {
					'fr': 'français',
					'en': 'english'
				}
			},
			prod : {// mode prod
				NMICRO_WEB_SERVER_URL : 'http://www.domain.com/',
				languesName: {
					'fr': 'français',
					'en': 'english'
				}
			}
		},
		web : {// out web
			dev : {// mode dev
				NMICRO_WEB_SERVER_URL : 'http://localhost:8080/',
				languesName: {
					'fr': 'français',
					'en': 'english'
				}
			},
			prod : {// mode prod
				NMICRO_WEB_SERVER_URL : 'http://www.domain.com/',
				languesName: {
					'fr': 'français',
					'en': 'english'
				}
			}
		}
	}
};
