# EXPRESS BOILERPLATE

### Get your Express project up and running easily with this boilerplate    
 - Designed to be deployed to Heroku.   
 - Due to pervious experiences of bugs when using Node 14.x and Heroku,   
configuations have been setup to use Node version 12.14, PG version 7.x, and ssl connection set to 'true' in production.
---

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME) with starter packages, folders and files:

1. Clone this repository to your local machine `git clone https://github.com/ZenMnky/knex-postgres-express-boilerplatet NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`
7. Update the paths to your DATABASE_URL and TEST_DATABASE_URL in .env, postgrator-config.js, and config.js


---

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run a watching test environment `npm run watch`

---

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`.  
This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's main branch.
