var express = require ('express');
var handlebars = require ('express-handlebars');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var axios = require('axios');
const { text } = require('body-parser');
const { callbackify } = require('util');

function scrape(callback){
  axios.get("https://www.history.com/news").then(function(response){

  var $ = cheerio.load(response.data);

  var results = [];
  //var display = 0;

  $(".m-card--content").each(function(i, element) {

   
    var link = 'history.com' + $(element).children('.m-ellipsis', 'a').attr("href"); //Selecting sub-elements here. 
    var link1 = $(element).children('a').attr('onclick', 'return').attr("href");
    console.log('link1=' + link1);

    var title = $(element).children('.m-ellipsis').text(); 
    var summary = $(element).children('.m-card--body').text();
    var link2 = $(element).parent('a').attr("href");
    console.log('link2=' + link2); 

   if (link1 == 'undefined'){
     link = 'History.com1' + link2;

   } else (link == 'History.com2' + link1);
    // display++;
    // if (display <= 5) {
         results.push({
           title: title,
           link: link,
           summary: summary
     });
     console.log("length = " + results.length);
    // }; 
    callback(results);
  });

 
});

}

module.exports = scrape;
