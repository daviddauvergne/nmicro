module.exports = {
	private : {
		close : function(me,e){
			e.stopPropagation();
			me.dispatchParents('nmDialogClose');
		}
	},
	// Events
	events : {
		click : {
			ok : function(e){
				private.close(this,e);
			},
			cancel : function(e){
				private.close(this,e);
			}
		}
	}
};
