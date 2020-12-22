const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeQuotesArray, makeMaliciousQuote } = require('./quotes.fixtures');

describe('Quotes endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  before('clean the table', () => db('favorite_quotes').truncate());

  after('disconnect from db', () => db.destroy());

  afterEach('cleanup', () => db('favorite_quotes').truncate());

  describe('GET /quotes', () => {
    context(`Given no quotes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/quotes')
          .expect(200, []);
      });
    });

    context('Given there are quotes in the database', () => {
      const testQuotes = makeQuotesArray();

      beforeEach('insert quotes', () => {
        return db
          .into('favorite_quotes')
          .insert(testQuotes);
      });

      it('GET /quotes responds with 200 and all quotes', () => {
        return supertest(app)
          .get('/quotes')
          .expect(200, testQuotes);
      });
    });

    // context(`Given an XSS attack article`, () => {
    //   const maliciousQuote = makeMaliciousQuote();
      
    //   beforeEach('insert malicious article', () => {
    //     return db
    //       .into('favorite_quotes')
    //       .insert([ maliciousQuote ]);
    //   });
      
    //   it('removes XSS attack content', () => {
    //     return supertest(app)
    //       .get(`/quotes`)
    //       .expect(200)
    //       .expect(res => {
    //         expect(res.body[0].title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;');
    //         expect(res.body[0].content).to.eql(`Bad image <img src='https://url.to.file.which/does-not.exist'>. But not <strong>all</strong> bad.`);
    //       });
    //   });
    // });
  });

  describe('POST /quotes', () => {
    it('creates a quote, responds with 201, and the new quote', function() {
      this.retries(3);
      const newQuote = makeQuotesArray(1)[0];
      return supertest(app)
        .post('/quotes')
        .send(newQuote)
        .expect(201)
        .expect((res) => {
          expect(res.body.content).to.eql(newQuote.content);
          expect(res.body.attribution).to.eql(newQuote.attribution);
          expect(res.body.source).to.eql(newQuote.source);
          expect(res.body.tags).to.eql(newQuote.tags);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/quotes/${res.body.id}`);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/quotes/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });

    const requiredFields = ['title', 'style', 'content'];
    requiredFields.forEach(field => {
      const newQuote = makeQuotesArray(1)[0];

      it(`responds with 400 and an error message when ${field} field is missing`, () => {
        delete newQuote[field];
        return supertest(app)
          .post('/quotes')
          .send(newQuote)
          .expect(400, {
            error: {message: `Missing ${field} in request body`}
          });
      });

      
    });

    context(`When an XSS attack article is put in, article is sanitized right away`, () => {
      const maliciousQuote = makeMaliciousQuote();
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .post(`/quotes`)
          .send(maliciousQuote)
          .expect(201)
          .expect(res => {
            expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;');
            expect(res.body.content).to.eql(`Bad image <img src='https://url.to.file.which/does-not.exist'>. But not <strong>all</strong> bad.`);
          });
      });
    });

   
  });

  describe('GET /quotes/:quote_id', () => {
    context(`Given no quotes`, () => {
      it(`responds with 404`, () => {
        const quoteId = 123456;
        return supertest(app)
          .get(`/quotes/${quoteId}`)
          .expect(404, { error: { message: `Quote doesn't exist` } });
      });
    });

    context('Given there are quotes in the database', () => {
      const testQuotes = makeQuotesArray();

      beforeEach('insert quotes', () => {
        return db
          .into('favorite_quotes')
          .insert(testQuotes);
      });

      it('GET /quotes/:id responds with 200 and the specified quote', () => {
        const quoteId = 3;
        const expected = testQuotes[quoteId - 1];
        return supertest(app)
          .get(`/quotes/${quoteId}`)
          .expect(200, expected);
      });
    });

  //   context(`Given an XSS attack quote`, () => {
  //     const maliciousQuote = makeMaliciousQuote();
      
  //     beforeEach('insert malicious article', () => {
  //       return db
  //         .into('favorite_quotes')
  //         .insert([ maliciousQuote ]);
  //     });
      
  //     it('removes XSS attack content', () => {
  //       return supertest(app)
  //         .get(`/quotes/${maliciousQuote.id}`)
  //         .expect(200)
  //         .expect(res => {
  //           expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;');
  //           expect(res.body.content).to.eql(`Bad image <img src='https://url.to.file.which/does-not.exist'>. But not <strong>all</strong> bad.`);
  //         });
  //     });
  //   });
  // });
  });

  describe(`DELETE /quotes/:quote_id`, () => {
    context(`Given no quotes`, () => {
      it(`responds with 404`, () => {
        const quoteId = 123456;
        return supertest(app)
          .delete(`/quotes/${quoteId}`)
          .expect(404, { error: { message: `Quote doesn't exist` } });
      });
    });

    context('Given there are quotes in the database', () => {
      const testQuotes = makeQuotesArray();
    
      beforeEach('insert quotes', () => {
        return db
          .into('favorite_quotes')
          .insert(testQuotes);
      });
    
      it('responds with 204 and removes the quote', () => {
        const idToRemove = 2;
        const expectedQuotes = testQuotes.filter(quote => quote.id !== idToRemove);
        return supertest(app)
          .delete(`/quotes/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/quotes`)
              .expect(expectedQuotes)
          );
      });
    });
  });

});
