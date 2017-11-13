
module.exports = {
	// Events
	events: {
		click: {
			add : function(e){
				e.stopPropagation();
				this.quantity++;
			},
			del : function(e){
				e.stopPropagation();
				if(this.quantity > 0)
					this.quantity--;
			},
			rm : function(e){
				e.stopPropagation();
				this.remove();
			}
		}
	},

	// definition of properties
	properties: {
		// a global property starts with the $ character
		$quantity : 0
	}
};
