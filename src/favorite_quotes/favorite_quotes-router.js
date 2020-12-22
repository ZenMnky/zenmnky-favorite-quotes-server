const express = require('express');
const FavoriteQuotesServices = require('./favorite_quotes-services');
const path = require('path');
const xss = require('xss');

const quotesRouter = express.Router();

const sanitizeQuote = quote => ({
    id: quote.id,
    content: xss(quote.content),
    attribution: xss(quote.attribution),
    source: xss(quote.source),
    tags: xss(tags)
})

quotesRouter
  .route('/')
  .get((req, res, next) => {
    FavoriteQuotesServices.getAllQuotes(req.app.get('db'))
      .then(quotes => res.json(quotes.map(sanitizeQuote)))
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { content, attribution, source, tags } = req.body;
    
    let reqFields = { content }
    let optionalFileds = { attribution, source, tags }
    
    // validate
    for (const [key, value] of Object.entries(reqFields)) {
      if(value === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }

    let newQuote = {
        ...reqFields,
        ...optionalFileds
    }

    FavoriteQuotesServices.insertQuote(
      req.app.get('db'),
      newQuote
    )
      .then(quote => {
        res
          .status(201)
          .location(path.posix.join (req.originalUrl, `/${quote.id}`))
          .json(sanitizeQuote(quote));
      })
      .catch(next);
  });

quotesRouter
  .route('/:quote_id')
  .all((req, res, next) => {
    FavoriteQuotesServices.getById(
      req.app.get('db'),
      req.params.quote_id
    )
      .then(quote => {
        if (!quote) {
          return res.status(404).json({
            error: { message: `Quote doesn't exist` }
          });
        };
        res.quote = quote;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    return res.json(sanitizeQuote(res.quote));
  })
  .patch(bodyParser, (req,res,next) => {
    const { content, attribution, source, tags } = req.body;
    
    let reqFields = { content }
    let optionalFileds = { attribution, source, tags }
    
    // validate
    for (const [key, value] of Object.entries(reqFields)) {
      if(value === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }

    let updatedQuote = {
        ...reqFields,
        ...optionalFileds
    }

    FavoriteQuotesServices.updateQuote(
        req.app.get('db'),
        req.params.quote_id,
        updatedQuote
    )
    .then(numRowsAffected => {
        return res.status(204).end()
    })
    .catch(next)        
})
  .delete((req, res, next) => {
    FavoriteQuotesServices.deleteArticle(
      req.app.get('db'),
      req.params.quote_id
    )
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = quotesRouter;
