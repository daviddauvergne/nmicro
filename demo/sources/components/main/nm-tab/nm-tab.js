// nm-tab.js
module.exports = {
	events: {
		click: function(e){
			e.stopPropagation();
			var curLth = [].slice.call(this.parentNode.children).indexOf(this);
			this.trigger('nm-tab-click',{index:curLth});
		}
	}
};
