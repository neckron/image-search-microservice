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

// ----------------------------------------------- setup /api/imagesearch/:searchString

app.get('/api/imagesearch/:searchString' , function(req ,res){

  // getting url params and query info
  var searchString = req.params.searchString;
  var offset = req.query.offset;
  var result;

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
         //res.send({'original':req.params});
       }
       db.close();
      });
    }
  });



  //building api api_arg
  var args = {
    parameters : {key : api_key,
                  q : searchString,
                  searchType : "image",
                  cx : cx_id,
                  start : offset },
   headers: { "Content-Type": "application/json" }
  }

  client.get(api_uri, args, function (data, response) {
    res.send(formatOutput(data.items))  ;
 });

});

// ----------------------------------------------- setup route /api/latest/imagesearch

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

// ----------------------------------------------- response formater

function formatOutput (array){
  var out = [];
  var obj;
  array.forEach( function(item){
    obj = {
      url : item.link,
      snippet : item.snippet,
      thumbnail : item.image.thumbnailLink,
      context : item.image.contextLink
    }
    out.push(obj);
  });

  return out;
}


// ----------------------------------------------- setup server

app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port %s!',process.env.PORT);
})
