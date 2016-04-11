var app = require('./app');
var Promise = require('bluebird');
var models = require('./models'),
    Author = models.Author,
    Book = models.Book,
    Chapter = models.Chapter;
var expect = require('chai').expect;
var supertest = require('supertest');
var agent = supertest.agent(app);
var fs = require('fs');
var mongoose = require('mongoose');

describe('fake library app', function () {

  function toPlainObject (doc) {
    return JSON.parse(JSON.stringify(doc));
  }

  function dropAll(){
    return Promise.all([
      Author.remove(), 
      Chapter.remove(), 
      Book.remove()
    ])
  }

  beforeEach(function () {
    return dropAll();
  });

  afterEach(function () {
    return dropAll();
  });

  xit('serves up static files (from the static folder in the public folder) on /files route', function (done) {
    agent
    .get('/files/index.html')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      fs.readFile(__dirname + '/public/static/index.html', function (err, contents) {
        if (err) return done(err);
        expect(res.text).to.equal(contents.toString());
        done();
      });
    });
  });

  xit('handles internal server errors', function (done) {
    // in an actual application, this route wouldn't exist
    // it's here just to test how you handle errors in an express app
    agent
    .get('/broken')
    .expect(500, done);
  });

  xit('handles custom errors', function (done) {
    // in an actual application, this route wouldn't exist
    // it's here just to test how you handle errors in an express app
    agent
    .get('/forbidden')
    .expect(403, done);
  });

  describe('/api', function () {

    describe('/books', function () {

      function randomMongoID () {
        return new mongoose.Types.ObjectId();
      }

      var author, book, chapter;

      beforeEach(function (done) {
        Author.create({
          firstName: 'Testy',
          lastName: 'McTesterson'
        }, function (err, a) {
          if (err) return done(err);
          author = a;
          done();
        });
      });

      beforeEach(function (done) {
        Chapter.create({
          title: 'First',
          text: 'Once upon a time, the end.',
          number: 1
        }, function (err, c) {
          if (err) return done(err);
          chapter = c;
          done();
        });
      });

      beforeEach(function (done) {
        Book.create([{
          title: 'Best Book Ever',
          author: author,
          chapters: [chapter]
        }, {
          title: 'Worst Book Ever',
          author: author
        }], function (err, bs) {
          if (err) return done(err);
          book = bs[0];
          done();
        });
      });

      xit('GET all', function (done) {
        agent
        .get('/api/books')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(2);
          done();
        });
      });

      xit('POST one', function (done) {
        agent
        .post('/api/books')
        .send({
          title: 'Book Made By Test',
          author: author._id,
          chapters: [chapter._id]
        })
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.title).to.equal('Book Made By Test');
          expect(res.body._id).to.exist;
          Book.findById(res.body._id, function (err, b) {
            if (err) return done(err);
            expect(b).to.not.be.null;
            expect(res.body).to.eql(toPlainObject(b));
            done();
          });
        });
      });
      
      xit('GET one', function (done) {
        agent
        .get('/api/books/' + book._id)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.title).to.equal(book.title);
          done();
        });
      });

      xit('GET one that doesn\'t exist', function (done) {
        agent
        .get('/api/books/' + randomMongoID())
        .expect(404)
        .end(done);
      });

      xit('GET one using invalid ID', function (done) {
        agent
        .get('/api/books/123abcnotamongoid')
        .expect(500)
        .end(done);
      });
      
      xit('PUT one', function (done) {
        agent
        .put('/api/books/' + book._id)
        .send({
          title: 'Book Updated By Test'
        })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.title).to.equal('Book Updated By Test');
          Book.findById(book._id, function (err, b) {
            if (err) return done(err);
            expect(b).to.not.be.null;
            expect(res.body).to.eql(toPlainObject(b));
            done();
          });
        });
      });

      xit('PUT one that doesn\'t exist', function (done) {
        agent
        .put('/api/books/' + randomMongoID())
        .send({title: 'Attempt To Update Book Title'})
        .expect(404)
        .end(done);
      });

      xit('PUT one using invalid ID', function (done) {
        agent
        .put('/api/books/123abcnotamongoid')
        .send({title: 'Attempt To Update Book Title'})
        .expect(500)
        .end(done);
      });

      xit('DELETE one', function (done) {
        agent
        .delete('/api/books/' + book._id)
        .expect(204)
        .end(function (err, res) {
          if (err) return done(err);
          Book.findById(book._id, function (err, b) {
            if (err) return done(err);
            expect(b).to.be.null;
            done();
          });
        });
      });

      xit('DELETE one that doesn\'t exist', function (done) {
        agent
        .delete('/api/books/' + randomMongoID())
        .expect(404)
        .end(done);
      });

      xit('DELETE one using invalid ID', function (done) {
        agent
        .delete('/api/books/123abcnotamongoid')
        .expect(500)
        .end(done);
      });

      xit('GET with query string filter', function (done) {
        agent
        // remember that in query strings %20 means a single whitespace character
        .get('/api/books?title=Best%20Book%20Ever')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          done();
        });
      });

/* ================================================================
   ----------------------------------------------------------------
   EVERYTHING AFTER THIS POINT IS NOT MANDATORY (THOUGH ENCOURAGED)
   ----------------------------------------------------------------
   ================================================================ */

      describe('/chapters', function () {

        var addedChapter, chapterBook;

        beforeEach(function (done) {
          Book.findOne({}, function (err, b) {
            if (err) return done(err);
            chapterBook = b;
            done();
          });
        });

        beforeEach(function (done) {
          chapterBook.addChapter({
            title: 'Added Chapter',
            number: 1,
            text: 'Once upon a time...'
          })
          .then(function (c) {
            addedChapter = c;
          })
          .then(done);
        });

        xit('GET all', function (done) {
          agent
          .get('/api/books/' + chapterBook._id + '/chapters')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // this should be an array of *chapters* not books
            expect(res.body).to.be.instanceof(Array);
            done();
          });
        });

        xit('POST one', function (done) {
          // notice the addChapter method we've provided for the Book model
          // it is helpful here!
          agent
          .post('/api/books/' + chapterBook._id + '/chapters')
          .send({
            title: 'Chapter Made By Test',
            text: 'A chapter made by a test',
            number: 11
          })
          .expect(201)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.title).to.equal('Chapter Made By Test');
            var createdChapter = res.body;
            Book.findById(chapterBook._id, function (err, b) {
              if (err) return done(err);
              expect(b.chapters).to.contain(createdChapter._id);
              Chapter.findById(createdChapter._id, function (err, c) {
                if (err) return done(err);
                expect(c).to.not.be.null;
                expect(res.body).to.eql(toPlainObject(c));
                done();
              });
            });
          });
        });
        
        xit('GET one', function (done) {
          var chapId = addedChapter._id.toHexString();
          agent
          .get('/api/books/' + chapterBook._id + '/chapters/' + chapId)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body._id).to.equal(chapId);
            done();
          });
        });

        xit('GET one that doesn\'t exist', function (done) {
          agent
          .get('/api/books/' + chapterBook._id + '/chapters/' + randomMongoID())
          .expect(404)
          .end(done);
        });

        xit('GET one using invalid ID', function (done) {
          agent
          .get('/api/books/123abcnotamongoid')
          .expect(500)
          .end(done);
        });
        
        xit('PUT one', function (done) {
          var chapId = addedChapter._id;
          agent
          .put('/api/books/' + chapterBook._id + '/chapters/' + chapId)
          .send({
            title: 'Chapter Updated By Test'
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.title).to.equal('Chapter Updated By Test');
            Chapter.findById(chapId, function (err, c) {
              if (err) return done(err);
              expect(c).to.not.be.null;
              expect(res.body).to.eql(toPlainObject(c));
              done();
            });
          });
        });

        xit('PUT one that doesn\'t exist', function (done) {
          agent
          .put('/api/books/' + chapterBook._id + '/chapters/' + randomMongoID())
          .send({
            title: 'Attempt To Update Chapter Title'
          })
          .expect(404)
          .end(done);
        });

        xit('PUT one using invalid ID', function (done) {
          agent
          .put('/api/books/' + chapterBook._id + '/chapters/123abcnotamongoid')
          .send({
            title: 'Attempt To Update Chapter Title'
          })
          .expect(500)
          .end(done);
        });

        xit('DELETE one', function (done) {
          // notice the removeChapter method we've provided for the Book model
          // it is helpful here!
          var chapId = addedChapter._id;
          agent
          .delete('/api/books/' + chapterBook._id + '/chapters/' + chapId)
          .expect(204)
          .end(function (err, res) {
            if (err) return done(err);
            Chapter.findById(chapId, function (err, c) {
              if (err) return done(err);
              expect(c).to.be.null;
              Book.findById(chapterBook._id, function (err, b) {
                if (err) return done(err);
                expect(b.chapters).to.not.contain(chapId);
                done();
              });
            });
          });
        });

        xit('DELETE one that doesn\'t exist', function (done) {
          agent
          .delete('/api/books/' + chapterBook._id + '/chapters/' + randomMongoID())
          .expect(404)
          .end(done);
        });

        xit('DELETE one using invalid ID', function (done) {
          agent
          .delete('/api/books/' + chapterBook._id + '/chapters/123abcnotamongoid')
          .expect(500)
          .end(done);
        });

      });

    });

    describe('/numVisits', function () {
      // remember express sessions?
      // https://github.com/expressjs/session

      xit('counts a client\'s visits to it', function (done) {
        // should originally send back zero
        // but should increment, thus returning one the next time around
        var clientA = agent;
        clientA
        .get('/api/numVisits')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.number).to.equal(0);
          clientA
          .get('/api/numVisits')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.number).to.equal(1);
            done();
          });
        });
      });


      xit('distinguises between clients', function (done) {
        // should be zero again for this client!
        var clientB = supertest.agent(app);
        clientB
        .get('/api/numVisits')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.number).to.equal(0);
          done();
        });

      });

    });

  });

});