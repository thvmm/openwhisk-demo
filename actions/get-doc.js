/*
 * Retrieve a document on a mongo database.
 *
 * @param params.MONGO_CA			SSL certificate to connect to a mongoDB instance
 * @param params.MONGO_URI			URI to connect
 * @param params.MONGO_DATABASE		mongoDB database to add a new doc
 * @param params.MONGO_COLLECTION	mongoDB collection to add a new doc
 *
 * @param (params.doc._id || params._id) Identifier do documento no mongoDB
*/
var mongo = require("mongodb");

function main(params) {
	console.log("Retrieving a doc from mongoDB:", params);
	
	var MongoClient = mongo.MongoClient;

	var ca = [new Buffer(params.MONGO_CA, 'base64')];
	var id = (params._id || params.doc._id);

	if(!id) {
		return {"error": "A document id must be passed."};
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
				

				mongodb.collection(params.MONGO_COLLECTION).findOne({'_id': mongo.ObjectID(id)}, function(error, result) {
					if (error) {
						console.log("Something went wrong on retrieving a doc...");
						reject(error);
					} else {
						console.log("Document successfully retrieved!");
						resolve(result);
					}
					db.close();
				});
			}
		})
	});

}	

