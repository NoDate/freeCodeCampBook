/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');

// Connect to database
mongoose.connect(process.env.DB);
let db = mongoose.connection;

let bookSchema;
let bookModel;

// Open connection
db.once('open', () => {
  // Create scheme
  bookSchema = new mongoose.Schema({
    title: String,
    comments: [String]
  });
  
  // Create book model
  bookModel = mongoose.model('book', bookSchema);
});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      // Get all books
      bookModel.find({}, (err, books) => {
        let bookList = [];

        // Add each book to list
        books.forEach((book) => {
          bookList.push({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          });
        });

        // Return books
        res.json(bookList);
        return;
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
    
      // Check if title provided
      if(!title) {
        res.send('no title provided');
        return;
      }
    
      // Add book
      let newBook = new bookModel({
        title: title,
        comments: []
      });
      newBook.save((err, newBook) => {        
        // Return book info
        res.json({
          title: newBook.title,
          comments: newBook.comments,
          _id: newBook._id
        });
        return;
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      // Delete all books
      bookModel.deleteMany({}, (err) => {
        // Return delete message
        res.send('complete delete successful');
        return;
      });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      // Get matching book
      bookModel.findById({ _id: bookid }, (err, book) => {
        // Check if book found
        if (!book) {
          res.send('no book exists');
          return;
        }

        // Return book info
        res.json({
          title: book.title,
          comments: book.comments,
          _id: book._id
        });
        return;
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      // Get matching book
      bookModel.findById(bookid, (err, book) => {
        // Check if book found
        if (!book) {
          res.send('no book exists');
          return;
        }
        
        // Add comment
        book.comments.push(comment);
        book.save((err, book) => {
          // Return book info
          res.json({
            title: book.title,
            comments: book.comments,
            _id: book._id
          });
          return;
        });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'

      // Remove book
      bookModel.findByIdAndDelete(bookid, (err, book) => {
        // Check if book found
        if (!book) {
          res.send('no book exists');
          return;
        }

        // Return success
        res.send('complete delete successful');
        return;
      });
    });
};
