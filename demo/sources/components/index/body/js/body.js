// body.js

// get external source
// var x = global.getSource('/directory/file');// sources/directory/file.js

module.exports = {
	// private
	private: {
		test: function () {
			console.log('private');
		}
	},
	// DOM actions
	dom: {
		insert: function () {
			var me = this;
			// dialogs -------------------------------------
			window.DIA = {
				'alert': function (title, message) {
					me.rend('dialog_alert', {
						'title': title,
						'message':	message,
						'close': function () {
							this.dispatchParents('nmDialogClose');
						}
					});
				},
				'confirm': function (title, message, callback) {
					me.rend('dialog_confirm', {
						'title': title,
						'message': message,
						'confirm': callback
					});
				}
			};
			// select rendData
			this.els.rendData.trigger('click');
		}
	}
};
