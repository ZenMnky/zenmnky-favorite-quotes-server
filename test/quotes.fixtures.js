const faker = require('faker');


const makeQuotesArray = (num = 4) => {
  let quoteArray = []

  for(let i = 0; i < num; i++){
    let newQuote = {
      id: (i + 1),
      content: faker.hacker.phrase(),
      attribution: faker.fake('{{name.prefix}} {{name.firstName}} {{name.lastName}}'),
      source: faker.lorem.sentence(),
      tags: [ `${faker.lorem.word()}`, `${faker.lorem.word()}`, `${faker.lorem.word()}`]
    }

    quoteArray.push(newQuote)
  }

  return quoteArray
  
}
// create expectedQuotes array
    // the testQuotes array of objects, 
    // in which each object has the tags value converted to a string
    // because the database returns arrays as a string
    
const makeExpectedQuotes = (testQuotes) => {
    const expectedQuotes = testQuotes.map(quoteObject => {
      let tagsAsString = quoteObject.tags.toString()
      quoteObject.tags = tagsAsString
      return quoteObject
    })  
}

const makeMaliciousQuote = () => {
  // code here
}

module.exports = {makeQuotesArray, makeMaliciousQuote, makeExpectedQuotes};