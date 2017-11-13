// nm-page-anim.js
module.exports = {

	// DOM actions
	dom: {
		insert: function(){
			this.change = false;
			this.time = 1;
			this.bkout = null;
			var _time = this.getAttribute('time');
			if(_time)
				this.time = _time*1;
			var animIn = this.getAttribute('in');
			if(animIn){
				var cl = 'animpage-'+animIn+'-in';
				var style = 'animation-duration:'+this.time+'s;';
				switch (animIn) {
					case 'slideleft':
					case 'slideright':
						style += 'overflow-x:hidden;';
					break;
				}
				var bkin = this.getAttribute('bkin');
				this.bkout = this.getAttribute('bkout');
				document.body.setAttribute('style',style);
				if(bkin){
					this.style.background = bkin;
				}
				document.body.classList.add(cl);
				var me = this;
				setTimeout(function () {
					document.body.removeAttribute('style');
					document.body.classList.remove(cl);
					document.body.setAttribute('style',style);
					me.change = true;
				}, this.time*1000);

			}
		}
	},
	// Events
	events: {
		'nm-page-change': function(e){
			e.preventDefault();
			var animOut = this.getAttribute('out');
			if(this.change && animOut){
				var cl = 'animpage-'+animOut+'-out';
				var style = 'animation-duration:'+this.time+'s;';
				switch (animOut) {
					case 'slideleft':
					case 'slideright':
						style += 'overflow:hidden;';
					break;
				}
				var me = this;
				if(this.bkout){
					style += 'height:100%;background:'+this.bkout+';';
				}

				document.body.setAttribute('style',style);

				document.body.classList.add(cl);

				setTimeout(function () {
					// document.location.href = e.detail.url;
				}, this.time*1000);
			} else if(this.change){
				document.location.href = e.detail.url;
			}
		}
	}
};
