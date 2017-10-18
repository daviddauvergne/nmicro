module.exports =  [
	function(next){
		console.log('click ----- click ------');
		simulant.fire( document.body.els.bar, 'click' );
		next();
	},
	function(next){
		console.log('log 2');
		console.info('info 2');
		console.debug('debug 2');
		console.warn('warn 2');
		console.error('error 2');
		next();
	}
];
