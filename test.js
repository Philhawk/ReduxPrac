var app = require('./app');
var models = require('./models'),
	Author = models.Author,
	Book = models.Book,
	Chapter = models.Chapter;
var expect = require('chai').expect;
var supertest = require('supertest');
var agent = supertest.agent(app);
var fs = require('fs');

describe('fake library app', function () {

	xit('serves up static files on /files route', function (done) {
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
		agent
		.get('/broken')
		.expect(500, done);
	});

	xit('handles custom errors', function (done) {
		agent
		.get('/forbidden')
		.expect(403, done);
	});

	describe('/api', function () {

		describe('books', function () {

			var author, book, chapter;

			before(function (done) {
				Author.create({
					firstName: 'Testy',
					lastName: 'McTesterson'
				}, function (err, a) {
					if (err) return done(err);
					author = a;
					done();
				});
			});

			before(function (done) {
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

			before(function (done) {
				Book.create({
					title: 'Best Book Ever',
					author: author,
					chapters: [chapter]
				}, function (err, b) {
					if (err) return done(err);
					book = b;
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
					done();
				});
			});

			xit('POST one', function (done) {
				agent
				.post('/api/books')
				.send({
					title: 'Made By Test',
					author: author._id,
					chapters: [chapter._id]
				})
				.expect(201)
				.end(function (err, res) {
					if (err) return done(err);
					expect(res.body.title).to.equal('Made By Test');
					done();
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
			
			xit('PUT one', function (done) {
				agent
				.put('/api/books/' + book._id)
				.send({
					title: 'Updated By Test'
				})
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					expect(res.body.title).to.equal('Updated By Test');
					done();
				});
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

			describe('chapters', function () {

				var chapterBook, newChapter;

				before(function (done) {
					Book.findOne({}, function (err, b) {
						if (err) return done(err);
						chapterBook = b;
						done();
					});
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
						title: 'Made By Test',
						text: 'A chapter made by a test',
						number: 11
					})
					.expect(201)
					.end(function (err, res) {
						if (err) return done(err);
						newChapter = res.body;
						expect(newChapter.title).to.equal('Made By Test');
						Book.findById(chapterBook._id, function (err, b) {
							if (err) return done(err);
							expect(b.chapters).to.contain(newChapter._id);
							Chapter.findById(newChapter._id, function (err, c) {
								if (err) return done(err);
								expect(c).to.not.be.null;
								done();
							});
						});
					});
				});
				
				xit('GET one', function (done) {
					var chapId = newChapter._id;
					agent
					.get('/api/books/' + chapterBook._id + '/chapters/' + chapId)
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err);
						expect(res.body._id).to.equal(chapId);
						done();
					});
				});
				
				xit('PUT one', function (done) {
					var chapId = newChapter._id;
					agent
					.put('/api/books/' + chapterBook._id + '/chapters/' + chapId)
					.send({
						title: 'Updated By Test'
					})
					.expect(200)
					.end(function (err, res) {
						if (err) return done(err);
						expect(res.body.title).to.equal('Updated By Test');
						done();
					});
				});
				
				xit('DELETE one', function (done) {
					// notice the removeChapter method we've provided for the Book model
					// it is helpful here!
					var chapId = newChapter._id;
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

			});

		});

		// remember express sessions?
		// https://github.com/expressjs/session
		describe('/numVisits', function () {

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