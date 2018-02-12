// event body.js

module.exports = {
	// Events
	events: {
		toolbar: function (e) {
			e.preventDefault();
			[].forEach.call(this.els.toolbar.querySelectorAll(':scope > button'), function (el) {
				if (el === e.target) {
					el.setAttribute('selected', 'true');
				} else {
					el.removeAttribute('selected');
				}
			});
		},
		click: {
			rendData: function (e) {
				this.rend('body_rend_data', {
					clickevt: function () {
						console.log('body-rend-data');
					},
					title: LC.cp.body.dtitle,
					content: '------------- ' + LC.cp.body.clickme + ' -------------'
				});
				this.rend('body_rend_data_code');
				this.els.rendData.trigger('toolbar');
			},
			rendDataLoop: function (e) {
				this.els.result.innerHTML = '';
				this.rend('body_rend_data_loop', [
					{content: 'xxxxxxxxxxxxxxxxxxxxxx'},
					{content: 'yyyyyyyyyyyyyyyyyyyyyy'},
					{content: 'zzzzzzzzzzzzzzzzzzzzzz'}
				]);
				this.rend('body_rend_data_loop_code');
				this.els.rendDataLoop.trigger('toolbar');
			},
			cpExLocale: function (e) {
				this.rend('body_rend_locale');
				this.rend('body_rend_locale_code');
				this.els.cpExLocale.trigger('toolbar');
			},
			cpExData: function () {
				// var el = this.rend({
				// 	overlay:  "result",
				// 	position: "replace",
				// 	template: [ "cp-ex-data" ]
				// },{value:LC.cp.body.dmessage, colorName: "orange", color:"blue"});

				var el = this.rend({
					overlay: 'result',
					position: 'replace',
					template: [ 'cp-ex-data', {color: 'blue'} ]
				}, {value: LC.cp.body.dmessage, colorName: 'orange'});

				setTimeout(function () {
					el.colorName = 'Oups blue !';
					el.setAttribute('color', 'orange');
				}, 1000);

				this.rend('body_cpExData_code');
				this.els.cpExData.trigger('toolbar');
			},
			dialogAlert: function () {
				DIA.alert(LC.cp.body.dtitle, LC.cp.body.dmessage);
				this.rend('body_rend_dialog_alert');
				this.rend('body_rend_dialog_alert_code');
				this.els.dialogAlert.trigger('toolbar');
			},
			dialogConfirm: function () {
				DIA.confirm(LC.cp.body.dtitle, LC.cp.body.dmessage, function (e) {
					e.preventDefault();
					console.log('ok confirmation !');
				});
				this.rend('body_rend_dialog_confirm');
				this.rend('body_rend_dialog_confirm_code');
				this.els.dialogConfirm.trigger('toolbar');
			},
			api: function () {
				var me = this;
				this.rend('body_rend_api_form', {callback: function (data) {
					me.rend('body_rend_api', data);
				}});
				this.rend('body_rend_api_code');
				this.els.api.trigger('toolbar');
			}
		}
	}
};
