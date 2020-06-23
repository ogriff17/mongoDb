var express = require("express");
var handlebars = require("handlebars");
//var mongojs = require("mongojs");
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var Note = require ('./models/Note.js');
var Article = require('./models/Article.js');
const bodyParser = require("body-parser");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { debug } = require("console");
 
mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));
 
app.use(express.static(process.cwd() + "/public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;
db.on('error', function(){
  console.log("Mongoose error: ", error);
});

db.once('open', function(){
  console.log("Mongoose connection successful!");
});

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  handlebars: allowInsecurePrototypeAccess(handlebars)
}));

app.set("view engine", "handlebars");

var router = express.Router();

require("./config/routes")(router);

app.use(router);

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(" app running on port " + port);
});

