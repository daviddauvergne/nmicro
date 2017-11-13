// body.js
module.exports = {
	dom: {
		insert: function(){
			this.els.xx.addEventListener('click',function(e){
				e.stopPropagation();
				this.trigger('nm-page-change',{url:'page-y.html'});
			});
		}
	}
};
