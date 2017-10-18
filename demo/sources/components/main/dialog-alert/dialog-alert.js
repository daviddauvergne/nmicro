module.exports = {
	scenarios : {
		foo : [
			function(){
				logg.info('dialog-alert show');
			}
		]
	},
	// Events
	events : {
		click : {
			close : function(e){
				e.preventDefault();
				this.trigger('nm-dialog-close');
			}
		}
	}
};
