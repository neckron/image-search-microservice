var express = require('express');
var mongodb = require('mongodb');
var dotenv = require('dotenv').config();
var Client = require('node-rest-client').Client;
var client = new Client();
var app = express();

// ----------------------------------------------- setup view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index.ejs');
})

app.use(express.static(__dirname + '/public'));

// ----------------------------------------------- using mongodb

var MongoClient = mongodb.MongoClient;
var mongo_url = process.env.MONGODB_URI;
var api_uri = process.env.GCS_API_URI;
var api_key = process.env.GCS_API_KEY;
var cx_id = process.env.GCS_ENGINE_ID;

// ----------------------------------------------- api args


// ----------------------------------------------- setup routes


//AIzaSyASKSpQpLkgVYAbJ__UEquIx3oQ1a-azMY

app.get('/api/imagesearch/:searchString' , function(req ,res){

  // getting url params and query info
  var searchString = req.params.searchString;
  var offset = req.query.offset;

  // storing string search to mongodb
  MongoClient.connect(mongo_url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var collection = db.collection('urls');
      var term = { term : searchString , when : new Date()}
      collection.insert(term, function(err,result){
        if (err) {
         console.log(err);
       } else {
         console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
         res.send({'original':req.params});
       }
       db.close();
      });
    }
  });

  /*

  //building api api_arg
  var api_args = {
    parameters : {key : 'AIzaSyASKSpQpLkgVYAbJ__UEquIx3oQ1a-azMY',
                  q  : 'searchString',
                  searchType : "image",
                  cx : "015664496648704284990:dtc2tyxj3gu"},
                  headers: { "Content-Type": "application/json" }
  }

  // connecting to api
  client.get('https://www.googleapis.com/customsearch/v1?key=AIzaSyASKSpQpLkgVYAbJ__UEquIx3oQ1a-azMY&q=searchString&searchType=image&cx=015664496648704284990%3Adtc2tyxj3gu', function (data, response) {
    console.log(response)  ;
 });*/

});

app.get('/api/latest/imagesearch' , function(req ,res){
  MongoClient.connect(mongo_url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var collection = db.collection('urls');
      collection.find().toArray(function (err, result) {
        if (err) {
         console.log(err);
       } else {
         res.send(result);
       }
       db.close();
      });
    }
  });
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port %s!',process.env.PORT);
})
