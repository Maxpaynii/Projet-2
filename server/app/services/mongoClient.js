

var MongoClient = require('mongodb').MongoClient;

// À MODIFIER PAR VOUS
var DB_USER = "userName";
var DB_PASSWORD = "userPassword";
var DB_DB = "dataBaseName";
var DB_HOST = "ds[6 chiffres].mlab.com";
var DB_PORT = "dbPort";

var DB_URL = "mongodb://" + DB_USER + ":" + DB_PASSWORD + "@" + DB_HOST + ":" + DB_PORT + "/" + DB_DB;

MongoClient.connect(DB_URL,{useNewUrlParser : true}, function(err,client){
    if(!err){
        console.log("Nous sommes connectés à " + client.s.options.dbName);
    }
    else{
        console.log(err);
    }
});