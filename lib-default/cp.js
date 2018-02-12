
window.$cp = (function (cpTmp) {
	var ALLCP = {};
	var METHODS = {};
	var PROPERTIES = {};
	var ids = 0;

	var removeProperties = function (props, elID) {
		if (props) {
			props.forEach(function (prop) {
				var index = PROPERTIES[prop].indexOf(elID);
				if (index > -1) {
					PROPERTIES[prop].splice(index, 1);
				}
			});
		}
	};

	var removeMethods = function (methods, elID) {
		if (methods) {
			methods.forEach(function (method) {
				var index = METHODS[method].indexOf(elID);
				if (index > -1) {
					METHODS[method].splice(index, 1);
				}
			});
		}
	};

	var getProperties = function (prop) {
		if (PROPERTIES[prop]) {
			return PROPERTIES[prop].map(function (id, i) {
				if (ALLCP[id]) {
					return ALLCP[id][prop];
				}
			});
		} else {
			return [];
		}
	};

	var dispathMethods = function (prop) {
		if (METHODS[prop]) {
			var values = getProperties(prop);
			METHODS[prop].forEach(function (id, i) {
				if (ALLCP[id]) {
					ALLCP[id][prop](values);
				}
			});
		}
	};

	var addALLCP = function (element) {
		if (element.__id) {
			ALLCP[element.__id] = element;
			element.__$properties.forEach(function (prop) {
				dispathMethods(prop);
			});
			element.__$methods.forEach(function (method) {
				dispathMethods(method);
			});
		}
	};

	var rmALLCP = function (element) {
		if (element.nodeType === 1 && ALLCP[element.__id]) {
			delete ALLCP[element.__id];
			var id = element.__id;
			var properties = element.__$properties;
			removeProperties(properties, id);
			removeMethods(element.__$methods, id);
			properties.forEach(function (prop) {
				dispathMethods(prop);
			});
		}
	};

	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.removedNodes.length) {
				for (var i = 0; i < mutation.removedNodes.length; i++) {
					var elr = mutation.removedNodes[i];
					if (elr.nodeType === 1 && ALLCP[elr.__id]) {
						[].forEach.call(elr.querySelectorAll('*'), function (elrc) {
							rmALLCP(elrc);
						});
						rmALLCP(elr);
					}
				}
			}

			if(mutation.addedNodes.length) {
				for (var j = 0; j < mutation.addedNodes.length; j++) {
					var ela = mutation.addedNodes[j];
					if(ela.__id) {
						[].forEach.call(ela.querySelectorAll('*'), function (elac) {
							addALLCP(elac);
						});
						addALLCP(ela);
					}
				}
			}
		});
	});
	observer.observe(document.documentElement, {childList: true, subtree: true, characterData: false});

/*
# Component methods

## api(name, route, data)

| Param | Type     | Description | Required |
|-------|----------|-------------| -------- |
| name  | `string` | API name    | Yes      |
| route | `string` | route name  | Yes      |
| data  | `object` | sent data   | No       |

```javascript
if(this.els.form.checkValidity()) {
	var data = new FormData(this.els.form);
	this.api('web','/test/route',{
		data : data,
		res : {
			http_200 : function (data) {
				...
			},
			http_500 : function (data) {
				 ...
			}
		}
	});
}
```
*/
	Element.prototype.api = function (name, route, data) {
		APIS[name][route](this, data);
	};
/*
## dispatchChildrens(methodName, stopPropagation, data, max)

| Param            | Type      | Description                                       | Required |
|------------------|-----------|---------------------------------------------------| -------- |
| methodName       | `string`  | method name                                       | Yes      |
| stopPropagation  | `boolean` | stop propagation to the first method encountered  | Yes      |
| data             | `object`  | sent data                                         | No       |
| max              | `integer` | maximum level of depth                            | No       |

*/
	var dispatchChildrens = function (children, methodName, stopPropagation, data, level, max) {
		var childs = [];
		for (var i = 0; i < children.length; i++) {
			if (children[i][methodName]) {
				children[i][methodName](data);
				if (stopPropagation)
					return children[i];
			}
			childs = childs.concat([].slice.call(children[i].children));
		}
		level++;
		if (level === max) {
			return null;
		}
		if (childs.length > 0) {
			return dispatchChildrens(childs, methodName, stopPropagation, data, level, max);
		}
		return null;
	};
	Element.prototype.dispatchChildrens = function (methodName, stopPropagation, data, max) {
		dispatchChildrens([].slice.call(this.children), methodName, stopPropagation, data, 0, max);
	};

	Element.prototype.__assignProperties = function (prop, el) {
		if (this.__propertiesEls[prop] === undefined) {
			this.__propertiesEls[prop] = [];
		}
		this.__propertiesEls[prop].push(el);
	};
	Element.prototype.__dispatchProperties = function (prop, value) {
		if (this.__propertiesEls[prop]) {
			this.__propertiesEls[prop].forEach(function (el) {
				el.innerHTML = value;
			});
		}
	};

/*
## dispatchMethods(props)

| Param  | Type                | Description           | Required |
|--------|---------------------|-----------------------| -------- |
| props  | `string` or `array` | properties to dispath | Yes      |

*/
	Element.prototype.dispatchMethods = function (props) {
		if (typeof props === 'string') {
			props = [props];
		}
		props.forEach(function (prop) {
			dispathMethods(prop);
		});
	};

/*
## dispatchParents(methodName, stopPropagation, data, max)

| Param            | Type      | Description                                       | Required |
|------------------|-----------|---------------------------------------------------| -------- |
| methodName       | `string`  | method name                                       | Yes      |
| stopPropagation  | `boolean` | stop propagation to the first method encountered  | Yes      |
| data             | `object`  | sent data                                         | No       |
| max              | `integer` | maximum level of depth                            | No       |

*/
	var dispatchParents = function (element, methodName, stopPropagation, data, level, max) {
		while (element.parentNode) {
			element = element.parentNode;
			if (element[methodName]) {
				element[methodName](data);
				if (stopPropagation) {
					return element;
				}
			}
			level++;
			if (level === max) {
				return null;
			}
		}
		return null;
	};
	Element.prototype.dispatchParents = function (methodName, stopPropagation, data, max) {
		dispatchParents(this, methodName, stopPropagation, data, 0, max);
	};

/*
## getProperties(props)

| Param  | Type                | Description       | Required |
|--------|---------------------|-------------------| -------- |
| props  | `string` or `array` | properties to get | Yes      |

*/
	Element.prototype.getProperties = function (props) {
		var result = {};
		if (typeof props === 'string') {
			props = [props];
		}
		props.forEach(function (prop) {
			var properties = getProperties(prop);
			if (properties.length === 1) {
				properties = properties[0];
			} else if (properties.length === 0) {
				properties = null;
			}
			result[prop] = properties;
		});
		return result;
	};

	var getOverlay = function (me, overlay) {
		if (overlay === ':scope') {
			return me;
		}
		var overlayEl = me.els[overlay];
		if(!overlayEl)
			overlayEl = me.querySelector(overlay);
		if(!overlayEl)
			overlayEl = document.querySelector(overlay);
		return overlayEl;
	};

	var createTpl = function (obj) {
		if(obj.template) {
			if(obj.overlay) {
				var tpl = {
					content: obj.template,
					overlay: obj.overlay
				};
				if(obj.position)
					tpl.position = obj.position;
				return tpl;
			} else {
				console.error('Error rending: overlay does not exist');
			}
		} else {
			console.error('Error rending: template does not exist');
		}
		return null;
	};
/*
## rend(tplName,data)

| Param    | Type     | Description   | Required |
|----------|----------|---------------| -------- |
| tplName  | `string` | template name | Yes      |
| data     | `object` | sent data     | No       |

```javascript
this.rend('tplName',{
	key! 'value'
});
```
*/
	Element.prototype.rend = function (tplName,data) {
		var tpl;
		if(typeof tplName=='string') {
			if(_CP[this.nodeName].templates && _CP[this.nodeName].templates[tplName])
				tpl = _CP[this.nodeName].templates[tplName];
		} else if(typeof tplName=='object') {
			tpl = createTpl(tplName);
		}

		if (tpl) {
			var overlayEl = getOverlay(this, tpl.overlay);
			if (overlayEl) {
				if (this.locale)
					tpl.content.locale = this.locale;
				if (tpl.position)
					tpl.content.position = tpl.position;
				tpl.content.data = {};
				if (data && Array.isArray(data)) {
					data.forEach(function (d) {
						if (data) {
							tpl.content.data = d;
						}
						tpl.content.toDomNodes(overlayEl);
					});
				} else {
					if (data) {
						tpl.content.data = data;
					}
					return tpl.content.toDomNodes(overlayEl);
				}
			} else {
				console.error('Error rending: element "' + tpl.overlay + '" does not exist');
			}
		} else {
			console.error('Error rending: template "' + tplName + '" does not exist');
		}
	};

/*
## trigger(eventName, data)

| Param      | Type     | Description   | Required |
|------------|----------|---------------| -------- |
| eventName  | `string` | event name    | Yes      |
| data       | `mixed`  | sent data     | No       |

```javascript
this.trigger('eventName',12);
```
*/
	Element.prototype.trigger = function (eventName, data) {
		var event = new CustomEvent(eventName, {
			detail: data,
			bubbles: true
		});
		this.dispatchEvent(event);
	};


//<DEV>
	// scenarios middelware
	var Scenarios = function () {};

	Scenarios.prototype.use = function (fn, el) {
		var self = this;
		this.go = (function (stack) {
			return function (next) {
				stack.call(self, function () {
					fn.call(self, next.bind(self, el));
				});
			}.bind(this);
		})(this.go);
	};

	Scenarios.prototype.go = function (next) {
		next();
	};
//</DEV>
	var toCamelCase = function (n) {
		return n.replace(/-([a-zA-Z])/g, function (m, w) {
			return w.toUpperCase();
		});
	};

	var setProperty = function (el, prop) {
		try {
			Object.defineProperty(el, prop, {
				set: function (val) {
					this['__' + prop] = val;
					el.__dispatchProperties(prop, val);
					el.dispatchMethods(prop);
				},
				get: function () {
					return this['__' + prop];
				}
			});
		} catch (e) {}
	};



	var prepareElement = function (el,name,contentLoaded) {
		if (_CP[name]) {
			var cpPromise = new Promise(function (resolve, reject) {

				// content elements if contentLoaded
				var contentLoadedNodes = null;
				if (contentLoaded && el.innerHTML.trim() !== '') {
					contentLoadedNodes = document.createElement('__');
					while (el.childNodes.length > 0) {
						contentLoadedNodes.appendChild(el.childNodes[0]);
					}
					el.innerHTML = '';
				}

				// vars
				var nameLower = toCamelCase(name.toLowerCase());
				ids++;
				el.els = {};
				el.__id = 'nm-' + ids;

				// =======================================================
				// attributes
				var AttributesHandler = {
					set: function (obj, prop, value) {
						obj[prop] = value;
						if (el.getAttribute(prop) !== value) {
							el.setAttribute(prop, value);
						}
					}
				};

				el.attrs = new Proxy({}, AttributesHandler);

				// get attributes if contentLoaded
				if (contentLoaded) {
					[].forEach.call(el.attributes, function (att) {
						el.attrs[att.name] = att.value;
					});
				}

				// setAttribute
				var elSetAttribute = el.setAttribute;
				el.setAttribute = function () {
					var attrs = _CP[name].attributes;
					if (attrs) {
						var attr = attrs[arguments[0]];
						if (attr && attr.set) {
							attr.set.apply(this, [arguments[1]]);
						}
					}

					elSetAttribute.apply(this, arguments);
					if (!el.attrs[arguments[0]] || el.attrs[arguments[0]] !== arguments[1]) {
						el.attrs[arguments[0]] = arguments[1];
					}
				};

				// getAttribute
				var elGetAttribute = el.getAttribute;
				el.getAttribute = function () {
					var attrs = _CP[name].attributes;
					if (attrs) {
						var attr = attrs[arguments[0]];
						if (attr && attr.get) {
							return attr.get.apply(this);
						}
					}
					return elGetAttribute.apply(this, arguments);
				};

				// =======================================================
				// locales
				el.locale = {};
				if (LC.cp[nameLower]) {
					el.locale = LC.cp[nameLower];
				}

				// =======================================================
				// properties
				el.__$properties = [];
				el.__propertiesEls = {};
				var propertiesAssign = [];
				for (var prop in _CP[name].properties) {

					var value = _CP[name].properties[prop];
					if (prop[0] === '$') {
						prop = prop.substr(1);
						el.__$properties.push(prop);
						if (!PROPERTIES[prop]) {
							PROPERTIES[prop] = [];
						}
						PROPERTIES[prop].push(el.__id);
					}

					setProperty(el, prop);
					var data = {
						name: prop,
						value: value
					};
					if (el.data && el.data[prop]) {
						data.value = el.data[prop];
					}
					propertiesAssign.push(data);
				}

				// =======================================================
				// methods
				el.__$methods = [];
				for (var methodName in _CP[name].methods) {
					var method = _CP[name].methods[methodName];
					if (methodName[0] === '$') {
						methodName = methodName.substr(1);
						el.__$methods.push(methodName);
						if (!METHODS[methodName]) {
							METHODS[methodName] = [];
						}
						METHODS[methodName].push(el.__id);
					}
					el[methodName] = method;
				}

				// =======================================================
				// events
				for (var ev in _CP[name].events) {
					if (typeof _CP[name].events[ev] === 'function') {
						el.addEventListener(ev, _CP[name].events[ev], false);
					} else {
						// delegation
						el.addEventListener(ev, function (e) {
							var elName = e.target.getAttribute('el');
							var nodeName = e.target.nodeName.toLowerCase();
							if (this.els[elName] && _CP[name].events[ev][elName]) {
								_CP[name].events[ev][elName].apply(this, [e]);
							} else if (_CP[name].events[ev][nodeName]) {
								_CP[name].events[ev][nodeName].apply(this, [e]);
							}
						}, false);
					}
				}

				// =======================================================
				// DOM remove, contentInsert, create
				if (_CP[name].dom ) {
					if (_CP[name].dom.remove) {
						var elRemove = el.remove;
						el.remove = function () {
							_CP[name].dom.remove.apply(this);
							elRemove.apply(this);
						};
					}
					if (_CP[name].dom.contentInsert) {
						el.contentInsert = _CP[name].dom.contentInsert;
					}

					if (_CP[name].dom.create) {
						_CP[name].dom.create.apply(el);
					}
				}

				// =======================================================
				// templating
				if (_CP[name].template) {
					_CP[name].template.locale = el.locale;
					_CP[name].template.data = el.data;
					_CP[name].template.toDomNodes(el, el);
				}

				if (contentLoadedNodes) {
					if (el.els.content) {
						while (contentLoadedNodes.childNodes.length > 0) {
							el.els.content.appendChild(contentLoadedNodes.childNodes[0]);
						}
						if (el.contentInsert) {
							el.contentInsert();
						}
					} else {
						while (contentLoadedNodes.childNodes.length > 0) {
							el.appendChild(contentLoadedNodes.childNodes[0]);
						}
					}
				}

				// assign properties
				propertiesAssign.forEach(function (props) {
					el[props.name] = props.value;
				});
				// Synchronisation attributs
				if (contentLoaded) {
					for (var att in _CP[name].attributes) {
						var attValue = elGetAttribute.apply(el, [att]);
						if (attValue !== null) {
							el.setAttribute(att, attValue);
						}
					}
				}

				// dom insert
				if (_CP[name].dom && _CP[name].dom.insert) {
					el.domInsert = _CP[name].dom.insert;
					if (contentLoaded) {
						el.domInsert();
					}
				}

//<DEV>
				if (_CP[name].scenarios && SCENARIOS.length > 0) {
					el.scenarii = new Scenarios();
					SCENARIOS.forEach(function (scenarPage) {
						if (_CP[name].scenarios[scenarPage]) {
							_CP[name].scenarios[scenarPage].forEach(function (scenar) {
								el.scenarii.use(scenar, el);
							});
						}
					});

					if (contentLoaded) {
						el.scenarii.go(function () {});
					}
			}
//</DEV>
				resolve();
			});
			cpPromise.catch(function (err) {
				console.error('Error prepare component: ' + name + '!', err);
			});
		}
	};

	var createElement = document.createElement;
	document.createElement = function (tag, data) {
		var element = createElement.call(this, tag);
		element.data = data;
		prepareElement(element, element.nodeName, false);
		return element;
	};

	window._CP = {};

	var cp = {
		push: function (data) {
			_CP[data.name.toUpperCase()] = data;
		}
	};

	document.addEventListener('DOMContentLoaded', function () {
		cpTmp.map(cp.push);
		[].forEach.call(document.querySelectorAll('*'), function (element) {
			prepareElement(element, element.nodeName, true);
		});
	});
	return cp;
})(window.$cp || []);
