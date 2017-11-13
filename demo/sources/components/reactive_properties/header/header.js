
module.exports = {
	methods: {
		// a global method starts with the $ character
		$quantity: function(data){
			this.quantities = data.reduce(function(a, b) {
				return a + b;
			}, 0);

			// get global properties
			console.log(this.getProperties(['quantities','quantity']));
		}
	},
	// definition of properties
	properties: {
		// a global property starts with the $ character
		$quantities : 0,
	}
};
