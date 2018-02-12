
module.exports = {
	events: {
		submit: {
			form: function (e) {
				e.preventDefault();
				if (this.els.form.checkValidity()) {
					var data = new FormData(this.els.form);
					this.api('web', '/test/route', {
						data: data,
						res: {
							http_200: function (data) {
								console.log('Server response:', data);
								this.callback(data);
							}
						}
					});
				}
			}
		}
	}
};
