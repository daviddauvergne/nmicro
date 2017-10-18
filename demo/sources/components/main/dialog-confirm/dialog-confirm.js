module.exports = {
	match : {
		'dialog-confirm' : {
			confirm:{el:'ok',event:'click'}
		},
	},
	// Events
	events : {
		click : {
			ok : function(e){
				e.preventDefault();
				this.trigger('nm-dialog-close');
			},
			cancel : function(e){
				e.preventDefault();
				this.trigger('nm-dialog-close');
			}
		}
	}
};
