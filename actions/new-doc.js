/*
 * Insert a new document on a mongo database.
 *
 * @param params.MONGO_CA			SSL certificate to connect to a mongoDB instance
 * @param params.MONGO_URI			URI to connect
 * @param params.MONGO_DATABASE		mongoDB database to add a new doc
 * @param params.MONGO_COLLECTION	mongoDB collection to add a new doc
*/
function main(params) {
	console.log("Inserting new doc to mongoDB:", params);
	var MongoClient = require("mongodb").MongoClient;
	var ca = [new Buffer(params.MONGO_CA, 'base64')];

	if(!params.doc) {
		return {"error": "A new document must be defined. Sample request body: {'doc': {...}}"};
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

				mongodb.collection(params.MONGO_COLLECTION).insertOne(params.doc, function(error, result) {
					if (error) {
						console.log("Something went wrong on inserting a new doc...");
						reject(result);
					} else {
						console.log("Document successfully inserted!");
						resolve(result);
					}
					db.close();
				});
			}
		})
	});

}	

