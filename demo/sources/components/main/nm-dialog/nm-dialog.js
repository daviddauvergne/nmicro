module.exports = {
	// private
	private : {
		resize : function(diaModalEl,diaEl) {
			var top = ((window.innerHeight / 2) - (diaEl.offsetHeight / 2));
			var left = ((window.innerWidth / 2) - (diaEl.offsetWidth / 2));

			// reste dans la fenêtre
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;

			diaEl.style.top = top + 'px';
			diaEl.style.left = left + 'px';
			diaEl.style.maxHeight = (window.innerHeight-top-30)  + 'px';
			diaEl.style.maxWidth = (window.innerWidth-left-20)  + 'px';
			diaModalEl.style.height = window.innerHeight + 'px';
		}
	},
	dom : {
		insert : function(){
			var me = this;
			setTimeout(function () {
				private.resize(me.els.dialogModal,me.els.content);
				me.els.content.style.visibility = 'visible';
			}, 80);

		}
	},
	// Évènements
	methods : {
		'nmDialogClose' : function(){
			this.remove();
		}
	}
};
