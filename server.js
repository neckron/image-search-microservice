var express = require('express');
var mongodb = require('mongodb');
var dotenv = require('dotenv').config();
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
var url = process.env.MONGODB_URI;



// ----------------------------------------------- setup routes

app.get('/create/:param' , function(req ,res) {
  if(validator.isURL(req.params.param )){
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    //TODO modify port
     var collection = db.collection('urls');
     console.log(req);
     var randomShort = randomstring.generate({length: 6,charset: 'alphabetic'});
     var url = {url : req.params.param , shortUrl :randomShort}
     collection.insert(url, function(err,result){
       if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        res.send({'original':req.params.param , 'shortUrl':getHost(req,randomShort)});
      }
      db.close();
     });
  }
});
}else{
  res.send({'error':'Invalid URL'});
}
});

app.get('/:param' , function(req, res){
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    //TODO modify port
     var collection = db.collection('urls');
     collection.find({shortUrl: req.params.param}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Found:', result);
        res.redirect(result[0].url);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        res.send({'original': 'Not found'});
      }
      db.close();
    });

  }
});
});

function getHost(req, generatedString){
  return req.protocol + '://' + req.get('host')+'/'+generatedString;
}


app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port %s!',process.env.PORT);
})
