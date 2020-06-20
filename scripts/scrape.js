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

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $(".m-card--content").each(function(i, element) {

   
    var link = 'history.com' + $(element).children('.m-ellipsis', 'a').attr("href"); 
    var title = $(element).children('.m-ellipsis').text();
    //console.log('title' + title);
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    
    var summary = $(element).children('.m-card--body').text();
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      summary: summary
    });
    callback(results);
  });

  // Log the results once you've looped through each of the elements found with cheerio
  //console.log(results);
});

}

module.exports = scrape;
