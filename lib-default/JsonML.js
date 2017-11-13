
(function(){
	var eregLoc = /\{\$([\w\.]*)\}/g;
	var eregDataG = /\[\$([\w\.]*)\]/g;
	var eregData = /\[\$([\w\.]*)\]/;
	var eregProp = /([\w\.]*)/;

	var getValue = function (n,data,ereg) {
		var key = n.match(ereg);
		if(key){
			var keys = key[1].split(".");
			var value = data[keys.shift()];
			try {
				keys.forEach( function (val) {value = value[val]; });
					return (value === null || value === undefined) ? "" : value;
			} catch(err) {
				return "";
			}
		}
		return null;
	};

	var assign = function(ereg,n,data){
		return n.replace(ereg, function (str, key) {
			var keys = key.split(".");
			var value = data[keys.shift()];
			try {
				keys.forEach( function (val) {value = value[val]; });
					return (value === null || value === undefined) ? "" : value;
			} catch(err) {
				return "";
			}
		});
	};

	var bind = function(n,locale,data){
		if(data){
			return assign(eregDataG,assign(eregLoc,n,locale),data);
		}
		return assign(eregLoc,n,locale);
	};
	var getName = function(ar){
		ar.shift();
		return ar.join('-');
	};

	/* Convert JsonML to DOM */
	Array.prototype.toDomNodes = function(element,refel,locale,data){

		if (typeof this[0] === 'string'){

			if(this.locale)
				locale = this.locale;

			if(this.data)
				data = this.data;

			var el = document.createElement(this[0],data);

			element = (typeof element === 'string') ? document.getElementById(element) : element;

			// add attributes
			if (this[1] && this[1].constructor == Object){
				var n = this[1];
				for (var a in this[1]){
					if (a === "style"){
						el.style = n[a];
					} else {
						if(a=='el' && refel){
							refel.els[n[a]] = el;
						}

						var attribute = a.split('-');
						var subName = attribute[0];
						if(subName=='on' || subName=='to'){
							var fnc = getValue(n[a],data,eregData);
							var actioName = getName(attribute);
							if(typeof fnc === 'function'){
								if(subName=='on'){
									el.addEventListener(actioName,fnc);
								} else {
									el[actioName] = fnc;
								}
							} else {
								console.error('Error event/method: data "'+n[a]+'" does not a function');
							}
						} else if(a=='property' && refel){
							var prop = n[a];
							if(prop[0]=='$'){
								prop = prop.substr(1);
							}
							refel.__assignProperties(prop,el);

							if(data && data[prop]){
								refel[prop] = data[prop];
							}
						} else if(a=='attribute' && refel){
							var attVal = n[a];
							// setAttribute
							var elSetAttribute = refel.setAttribute;
							refel.setAttribute = function(name,val) {
								if(name==n[a])
									el.innerHTML = val;
								elSetAttribute.apply(this, arguments);
							};

							if(data && data[attVal]){
								refel.setAttribute(attVal,data[attVal]);
							}

						} else {
							// if(_CP[this[0].toUpperCase()])
							// 	el.attrs[a] = bind(n[a],locale,data);

							el.setAttribute(a, bind(n[a],locale,data));
						}
					}
				}
			}

			if (element){
				if(this.position){

					var elContent = element;
					if(element.els && element.els.content)
						elContent = element.els.content;

					if(this.position=='replace'){
						if (elContent.hasChildNodes()) {
							while (elContent.childNodes.length >= 1)
								elContent.removeChild(elContent.firstChild);
						}
						elContent.appendChild(el);
					} else {
						elContent.insertAdjacentElement(this.position,el);
					}

					if(element.contentInsert)
						element.contentInsert();
				} else {
					if(_CP[element.nodeName] && refel instanceof HTMLElement===false && element.els.content){
						element.els.content.appendChild(el);
						if(element.contentInsert)
							element.contentInsert();
					} else {
						element.appendChild(el);
						if(element.contentInsert)
							element.contentInsert();
					}
				}
			}

			for (var i=1,l=this.length;i<l;i++) {
				var n = this[i], c = n.constructor;

				if (c === String){
					if(el.els && el.els.content){
						el.els.content.appendChild(document.createTextNode(bind(n,locale,data)));
					} else {
						el.appendChild(document.createTextNode(bind(n,locale,data)));
					}
				} else if (c === Array){
					n.toDomNodes(el, refel, locale, data);
				}
			}
			if(el.domInsert)
				el.domInsert();

//<DEV>
			if(el.scenarii)
				el.scenarii.go(function(){});
//</DEV>
			return el;
		}
		return null;
	};
})();
