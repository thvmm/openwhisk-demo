/*
 * Update a mongoDB documet.
 *
 * @param params.MONGO_CA			SSL certificate to connect to a mongoDB instance
 * @param params.MONGO_URI			URI to connect
 * @param params.MONGO_DATABASE		mongoDB database to add a new doc
 * @param params.MONGO_COLLECTION	mongoDB collection to add a new doc
*/
var mongo = require("mongodb");

function main(params) {
	console.log("Updating a doc to mongoDB:", params);
	var MongoClient = mongo.MongoClient;
	var ca = [new Buffer(params.MONGO_CA, 'base64')];

	if(!params.payload) {
		return {"error": "A update clause must be specified. Sample request body:" +
		"{payload: {query: { name: 'Andy' }, sort: { rating: 1 }, update: { $inc: { score: 1 } }, upsert: true}}"};
	}

	return new Promise(function(resolve, reject) {
		MongoClient.connect(params.MONGO_URI, {
			mongos: {
				ssl: true,
				sslValidate: true,
				sslCA: ca,
				poolSize: 1,
				reconnectTries: 1
			}
		}, function(err, db) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				var mongodb = db.db(params.MONGO_DATABASE);
				mongodb.collection(params.MONGO_COLLECTION).findAndModify(params.payload, function(error, result) {
					if (error) {
						console.log("Something went wrong on updating a doc...");
						reject(error);
					} else {
						console.log("Document successfully updated!");
						resolve(result);
					}
					db.close();
				});
			}
		})
	});

}	

