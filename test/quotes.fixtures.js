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
console.log(makeQuotesArray(1))

const makeMaliciousQuote = () => {
  // code here
}

module.exports = {makeQuotesArray, makeMaliciousQuote};