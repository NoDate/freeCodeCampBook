/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testID;

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test Book Title'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'Test Book Title');
            assert.property(res.body, '_id');
            testID = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no title provided');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'commentcount');
            done();
          });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/VOID')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testID)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, testID);
            assert.property(res.body, 'comments');
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testID)
          .send({ 
            comment: 'Test comment.'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, testID);
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.include(res.body.comments, 'Test comment.');
            done();
          });
      });   
    });
  });
});
