
window.$cp = (function(cpTmp) {

	// match for assign data
	var match = function(overlayEl,name,origin,data){
		// assign data to element DOM
		var _assignToDom = function(el,data,tpl){
			if(el.els && el.els.content){
				if(tpl.position){
					if(typeof data[k] =='string')
						el.els.content.insertAdjacentHTML(position,data);
					else
						el.els.content.insertAdjacentElement(position,data);
				} else {
					el.els.content.appendChild(data);
				}
				if(el.contentInsert)
					el.contentInsert();
			} else {
				el.innerHTML = data;
			}
		};

		var toMatch = {};
		// teamplate matching for this key
		if(overlayEl.match && overlayEl.match[name]){
			toMatch = overlayEl.match[name];
		}

		// data
		for (var k in data) {
			var el = null;
			var all = false;
			var matchKey = null;
			var els;

			if(toMatch[k])
				matchKey = toMatch[k];

			// data content for this key
			var dataKey = data[k];

			// search element to assign data
			if(matchKey){
				if(matchKey.selector){
					if(matchKey.selector==':scope')
						el = overlayEl;
					else
						el = overlayEl.querySelector(matchKey.selector);
				} else if(matchKey.selectorAll){
					el = overlayEl.querySelectorAll(matchKey.selector);
					all = true;
				} else if(matchKey.el && overlayEl.els && overlayEl.els[matchKey.el]) {
					el = overlayEl.els[matchKey.el];
				}
			} else {
				if(overlayEl.els && overlayEl.els[k]){
					el = overlayEl.els[k];
				}
			}
			// element exist
			if(el){
				if(matchKey && matchKey.replace)
					dataKey = this.tpl(matchKey.replace,{value:dataKey});

				if(all)
					els = [].slice.call(el);
				else
					els = [el];

				els.forEach(function(_el){
					if(matchKey){
						if(matchKey.propertie){
							_el[matchKey.propertie] = dataKey;
						} else if(matchKey.attribute){
							_el.setAttribute(matchKey.attribute,dataKey);
						} else if(matchKey.event){
							_el.addEventListener(matchKey.event,dataKey);
						} else if(matchKey.method){
							_el.method(dataKey);
						} else {
							_assignToDom(_el,dataKey,matchKey);
						}
					} else {
						_assignToDom(_el,dataKey,matchKey);
					}
				});

			} else {
				// element doest not exist
				// search component
				els = [].slice.call(overlayEl.querySelectorAll(k));
				if(els.length>0){
					// if element then rend data content for this key
					els.forEach(function(el){
						el.rend(dataKey);
					});
				} else {
					logg.error(' Error [matching from '+origin+': '+name+'] no element found: '+k);
				}
			}
		}
	};
//<DEV>
	// scenarios middelware
	var Scenarios = function(){};

	Scenarios.prototype.use = function(fn,el) {
		var self = this;
		this.go = (function(stack) {
			return function(next) {
				stack.call(self, function() {
					fn.call(self, next.bind(self,el));
				});
			}.bind(this);
		})(this.go);
	};

	Scenarios.prototype.go = function(next) {
		next();
	};
//</DEV>
	var toCamelCase = function(n){
		return n.replace(/-([a-zA-Z])/g, function (m, w) {
			return w.toUpperCase();
		});
	};

	var prepareElement = function(el,name,contentLoaded){
		if (_CP[name]) {
		var cpPromise = new Promise(function(resolve, reject) {
			var contentLoadedNodes = null;
			if(contentLoaded && el.innerHTML.trim()!=''){
				contentLoadedNodes = document.createElement('__');
				while (el.childNodes.length > 0) {
					contentLoadedNodes.appendChild(el.childNodes[0]);
				}
				el.innerHTML = '';
			}
			var nameLower = toCamelCase(name.toLowerCase());
			el.cpname = name;
			el.els = {};
			el.attrs = [];
			el.locale = {};

			if(contentLoaded){
				[].forEach.call(el.attributes, function(att) {
					el.attrs.push(att.name);
				});
			}

			// setAttribute
			var elSetAttribute = el.setAttribute;
			el.setAttribute = function() {
				var attrs = _CP[name].attributes;
				if (attrs) {
					var attr = attrs[arguments[0]];
					if (attr && attr.set)
						attr.set.apply(this, [arguments[1]]);
				}
				elSetAttribute.apply(this, arguments);
			};

			// getAttribute
			var elGetAttribute = el.getAttribute;
			el.getAttribute = function() {
				var attrs = _CP[name].attributes;
				if (attrs) {
					var attr = attrs[arguments[0]];
					if (attr && attr.get)
						return attr.get.apply(this);
				}
				return elGetAttribute.apply(this, arguments);
			};

			if(LC.cp[nameLower])
				el.locale = LC.cp[nameLower];

			// methods
			for (var a in _methods)
				el[a] = _methods[a];

			for (a in _CP[name].methods)
				el[a] = _CP[name].methods[a];

			// properties
			for (a in _CP[name].properties)
				Object.defineProperty(el, a, _CP[name].properties[a]);

			// events
			for (a in _CP[name].events){

				if(typeof _CP[name].events[a] === 'function'){
					el.addEventListener(a, _CP[name].events[a], false);
				} else {
					// delegation
					el.addEventListener(a, function(e){
						var elName = e.target.getAttribute('el');
						var nodeName = e.target.nodeName.toLowerCase();
						if(this.els[elName] && _CP[name].events[a][elName]){
							_CP[name].events[a][elName].apply(this, [e]);
						} else if(_CP[name].events[a][nodeName]){
							_CP[name].events[a][nodeName].apply(this, [e]);
						}
					}, false);
				}
			}

			if(_CP[name].dom ) {
				if(_CP[name].dom.remove){
					var elRemove = el.remove;
					el.remove = function() {
						_CP[name].dom.remove.apply(this);
						elRemove.apply(this);
					};
				}
				if(_CP[name].dom.contentInsert)
					el.contentInsert = _CP[name].dom.contentInsert;

				if(_CP[name].dom.create)
					_CP[name].dom.create.apply(el);
			}

			if(_CP[name].template){
				_CP[name].template.locale = el.locale;
				_CP[name].template.toDomNodes(el,el);
			}

			if(_CP[name].match){
				el.match = _CP[name].match;
			}

			if(contentLoadedNodes){
				if(el.els.content){
					while (contentLoadedNodes.childNodes.length > 0) {
						el.els.content.appendChild(contentLoadedNodes.childNodes[0]);
					}
					if(el.contentInsert)
						el.contentInsert();
				} else {
					while (contentLoadedNodes.childNodes.length > 0) {
						el.appendChild(contentLoadedNodes.childNodes[0]);
					}
				}
			}

			// 	Synchronisation attributs
			if ( contentLoaded ) {
				for (a in _CP[name].attributes) {
					var attValue = elGetAttribute.apply(el, [a]);
					if (attValue!==null)
						el.setAttribute(a, attValue);
				}
			}

			// dom insert
			if(_CP[name].dom && _CP[name].dom.insert){
				el.domInsert = _CP[name].dom.insert;
				if ( contentLoaded )
					el.domInsert();
			}

//<DEV>
			if(_CP[name].scenarios && SCENARIOS.length>0) {
				el.scenarii = new Scenarios();
				SCENARIOS.forEach(function(scenarPage){
					if(_CP[name].scenarios[scenarPage]){
						_CP[name].scenarios[scenarPage].forEach(function(scenar){
							el.scenarii.use(scenar,el);
						});
					}

				});

				if ( contentLoaded )
					el.scenarii.go(function(){});
			}
			el.simulate = function(enventName,opts){
				// https://github.com/Rich-Harris/simulant
				simulant.fire( el, enventName, opts);
			};
//</DEV>
			resolve();
		});
		cpPromise.catch(function(err) {
			logg.error("Error prepare component: "+name+"!", err);
		});
		}
	};

	var createElement = document.createElement;
	document.createElement = function(tag) {
		var element = createElement.call(this, tag);
		prepareElement(element,element.nodeName,false);
		return element;
	};

	var _methods = {
		api: function(name,route,data){
			APIS[name][route](this,data);
		},
		trigger: function(eventName, data){
			var event = new CustomEvent(eventName,{
					detail: data,
					bubbles: true
				}
			);
			this.dispatchEvent(event);
		},
		rend: function(tplNameOrData,data){
			if(typeof tplNameOrData=='string'){
				var tplName = tplNameOrData;
				var tpl = _CP[this.cpname].templates[tplName];
				if(tpl){
					var overlayEl = this.els[tpl.overlay];
					if(!overlayEl)
						overlayEl = this.querySelector(tpl.overlay);
					if(!overlayEl)
						overlayEl = document.querySelector(tpl.overlay);
					if(overlayEl){
						tpl.content.toDomNodes(overlayEl);
						if(data)
							match(overlayEl,tplName,'template',data);
					} else {
						logg.error('Error rending: element "'+tpl.overlay+'" does not exist');
					}
				} else {
					logg.error('Error rending: template "'+tplName+'" does not exist');
				}
			} else {
				data = tplNameOrData;
				match(this,this.cpname.toLowerCase(),'component',data);
			}
		}
	};
	window._CP = {};

	var cp = {
		push: function( data ){
			_CP[data.name.toUpperCase()] = data;
		}
	};

	document.addEventListener("DOMContentLoaded",function(){
		cpTmp.map(cp.push);
		[].forEach.call(document.querySelectorAll('*'), function(element) {
			prepareElement(element, element.nodeName ,true);
		});
	});
	return cp;
})(window.$cp||[]);
