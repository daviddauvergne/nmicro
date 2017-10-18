// xxx.js

// get external source
// var x = global.getSource('/directory/file');// sources/directory/file.js

module.exports = {
	// private
	private : {
		test : function(){
			console.log('private');
		}
	},

	// DOM actions
	dom : {
		insert : function(){
			console.log('DOM insert component xxx');
			private.test();
		},
		create : function(){
			console.log('DOM create component xxx');
		},
		remove : function(){
			console.log('DOM before remove component xxx');
		},
		contentInsert : function(){
			console.log("DOM contentInsert component xxx");
		},
	},
	// methods
	methods : {
		foo : function(){
			console.log('foo method xxx');
		}
	},
	// Events
	events : {
		click : function(e){
			e.preventDefault();
			console.log('Click xxx');
		}
	},
	// attributes
	attributes : {
		value : {
			set : function(val){
				this._value = val;
				console.log(val);
			},
			get :function(){
				return this._value;
			}
		}
	},
	// properties
	properties : {
		y : {
			set : function(val){
				console.log(val);
			},
			get :function(){
				return this.y;
			}
		}
	},
	// macth component rend
	match : {
			// template id
			'xxx' : {
				// match va permettre de mettre en relation des clés de données aux élements d'un template

				// Pour q'une valeur soit attribué : à un attribut, une propriété, au contenu d'un élément ...

				// par défaut :


				// 1) recherche de l'élément
				//  - selector : CSS selector depuis l'overlay or ':scope' for select overlay element
				//  - selectorAll : CSS selector depuis l'overlay
				//  - el : sélection de l'élément avec l'attribut el="..."
				// 	- par default : si le template contient un élément avec el="key" (même clé que data)

				// 2) partie de l'élément à assigner
				// 	- attribute : nom de l'attribut (ex: name -> <x name="data[key]"></x>)
				// 	- propertie : nom de propriété : (ex: name -> x.name = data[key] )
				// 	- position : beforebegin -<p>- afterbegin - beforeend -</p>- afterend
				// 	- par default : <x>data[key]</x>

				// 3) remplacement
				// templating pour remplacer la valeur dans un string 'xxx{{value}}yyyy'

				// 4) function
				// function:function(element,value){...}
			}
		}
};
