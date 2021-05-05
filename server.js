'use strict';

// application requirment
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
// const superagent = require('superagent');


// application setup
const server =express();
const PORT = process.env.PORT || 5000;
server.use(express.urlencoded({ extended: true })); // to read the data in the post requiest
server.set('view engine','ejs');//to use Ejs templiting
server.use(express.static('./public'));//to use the static files in the public folder
server.use(cors()); //open for any request from any client


//////////////////////////////////////💨💨💨💨 home page 💨💨💨💨///////////////////////////////////////
//  home page handing => http://localhost:4000/
server.get('/' , homeHandler);

function homeHandler(req, res){
  res.render('pages/index');
}
//////////////////////////////////////💨💨💨💨  form page 💨💨💨💨/////////////////////////////////////
//  fomr page handing => http://localhost:4000/searches/new
// form page handler (new.ejs)
server.get('/searches/new' , newHandler);

function newHandler(req, res){
  res.render('pages/searches/new');
}
/////////////////////////////////////💨💨💨💨  show page 💨💨💨💨/////////////////////////////////////
//  fomr page handing => http://localhost:4000/searches/new
// form page handler (new.ejs)
server.post('/searches' , showHandler);

function showHandler(req, res){
  let searchkeyword = req.body.keyword;
  let choice = req.body.choice;
  let bookApiUrl = `https://www.googleapis.com/books/v1/volumes?q=+${choice}:${searchkeyword}`;
  console.log(`${searchkeyword} and ${choice}`);

  // arrar to save books objects
  let bookArray = [];

  superagent.get(bookApiUrl).then((result) => {
    let searchData = result.body.items;
    // let volum = result.body.items.volumeInfo;
    // console.log(volum);
    bookArray = searchData.map((element) => {
      return new Book(element);
    });
    // rendaer data to show page
    res.render('./pages/searches/show' , {bookObjectsArray:bookArray });
  }).catch((error) => {
    console.log(error);
    res.send(error);
  });
}

// book constructor
function Book (booksData) {
  // can be no title for the cook
  this.title = (booksData.volumeInfo.title) ? booksData.volumeInfo.title : 'No Match';

  // there is more than one auther so i have to join them and can be no auters founds
  this.authers = (booksData.volumeInfo.authers)? booksData.volumeInfo.authers.join(' , ') : 'No Authers Found';

  // if there is descripthion or not
  this.description = (booksData.volumeInfo.description) ? booksData.volumeInfo.description : 'No Description Found';

  // if there is img in poth urls use it or use backup img from terllo
  //if (undefind) dosont mean => fasle it will return error
  this.image = (booksData.volumeInfo.imageLinks) ? booksData.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
}

////////////////////////////////////💨💨💨💨  hello route  💨💨💨💨 ///////////////////////////////////
//  home page route handing => http://localhost:4000/hello
server.get('/hello', (req, res) => {
  // res.send('home route');
  res.render('./pages/index');
});
////////////////////////////////////💨💨💨💨  conniction  💨💨💨💨 ///////////////////////////////////
// connect to port
server.listen(PORT , ()=>{
  console.log(`CONNECT TO PORT : ${PORT}`);
});
