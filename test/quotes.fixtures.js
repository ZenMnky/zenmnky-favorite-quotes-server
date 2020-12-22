const faker = require('faker');

const makeQuotesArray = (num = 4) => {
  console.log('num:', num)
  let quoteArray = []

  for(let i = 0; i < num; i++){
    let newQuote = {
      content: faker.hacker.phrase(),
      attribution: faker.fake('{{name.prefix}} {{name.firstName}} {{name.lastName}}'),
      source: faker.lorem.sentence(),
      tags: faker.random.arrayElements()
    }

    quoteArray.push(newQuote)
  }

  return quoteArray
  
}

const makeMaliciousQuote = () => {
  // code here
}

module.exports = {makeQuotesArray, makeMaliciousQuote};