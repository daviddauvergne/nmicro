// body.js
module.exports = {
	// DOM actions
	dom: {
		insert: function(){
			var name = this.locale.product + " 3";
			this.rend('products',{name:name,quantity:5});
		}
	}
};
