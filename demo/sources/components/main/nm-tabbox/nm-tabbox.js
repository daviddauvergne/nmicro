// nm-tabbox.js
module.exports = {
	dom: {
		insert: function(){
			var selected = this.querySelector(':scope > nm-tabs > nm-tab[selected="true"]');
			if(!selected)
				selected = this.querySelector(':scope > nm-tabs > nm-tab:first-child');
			if(selected)
				selected.trigger('click');
		}
	},
	events: {
		'nm-tab-selected': function(e){
			e.preventDefault();
			[].forEach.call(this.querySelector(':scope > nm-tabpanels').children, function(el,i){
				if(i==e.detail.index)
					el.setAttribute('selected','true');
				else
					el.removeAttribute('selected');
			});
		}
	}
};
