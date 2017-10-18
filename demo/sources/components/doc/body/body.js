const scenarios = global.getSource('/dx/xxx');

module.exports = {
	scenarios : {
		foo : scenarios
	},

	// DOM actions
	dom : {
		insert : function(){
			var me = this;
			// dialogs -------------------------------------
			window.DIA = {
				'alert': function(title,message){
					me.rend('dialog_alert',{// template name
						'nm-dialog:last-child dialog-alert' : {// component selector to assign data
							'title':		title,// el="title" -> title
							'message':	message,// el="message" -> message
						}
					});
				},
				'confirm': function(title,message,callback){
					me.rend('dialog_confirm',{// template name
						'nm-dialog:last-child dialog-confirm' : {// component selector to assign data
							'title': 		title,// el="title" -> title
							'message': 	message,// el="message" -> message
							'confirm': 	callback// el="ok" -> callback (event->click)
						}
					});
				}
			};
		}
	},
	// méthodes
	methods : {
		insert : function(val){
			this.rend({'value':val});
		}
	},
	// Évènements
	events : {
		click : {
			'foo' : function(e){console.log('foo !!!!');},
			'bar' : function(e){

				DIA.alert('Title alert 1','alert 1');
				DIA.confirm('Title confirm 1','confirm 1',function(e){
					e.preventDefault();
					console.log('ok confirm 1');
				});
				DIA.alert('Title alert 2','alert 2');
				DIA.confirm('Title confirm 2','confirm 2',function(e){
					e.preventDefault();
					console.log('ok confirm 2');
				});
// {
// 	'title':'xxxxxxxxxxx',
// 	'message':'fdsdfsdfsdf dsf <br/>fds fds fds fds'
// }
// 				console.log(x);
				// console.log('bar !!!!');
				// console.log(e);
				// this.api('web','testRoute',{
				// 	data : {txt:'xxxxxxxxx'},
				// 	res : {
				// 		http_200 : function(data){
				// 			// data {key : 'xxxxx'}
				// 			console.log('Server response:',data);
				// 		}
				// 	}
				// });
			}
		}
	}
};
