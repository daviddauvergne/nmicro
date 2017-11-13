// nm-tabs.js
module.exports = {
	// Events
	events: {
		'nm-tab-click': function(e){
			e.preventDefault();
			[].forEach.call(this.children, function(el,i){
				if(i==e.detail.index)
					el.setAttribute('selected','true');
				else
					el.removeAttribute('selected');
			});
			this.trigger('nm-tab-selected',{index:e.detail.index});
		}
	}
};
