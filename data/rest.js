
// package restify <http://restify.com/>
module.exports = {
	"/test/route" : function(req, res, next, restify, faker){

		var data = faker("test/response");

		data.str = req.params.str;

		res.send(data);

		return next();
		// Erreurs <http://restify.com/#error-handling>
		// Ex: error 400
		// return next(new restify.BadRequestError('Bad Request'));
	}
};
