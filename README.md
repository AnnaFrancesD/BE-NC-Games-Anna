NC Games API

This is an API which can be used to access board game review data from a PSQL database.

Link to the API: https://anna-nc-games-app.herokuapp.com/

Setup

1. First fork the repo, then clone to your local machine:

- git clone "repo-address-here"



2. Install dependencies

Ensure you have installed dotenv, express, husky, jest, jest-extended, pg, and pg-format as dependencies, and supertest and jest-sorted as dev dependencies:

dotenv: https://www.npmjs.com/package/dotenv

express: https://expressjs.com/en/starter/installing.html

husky: https://www.npmjs.com/package/husky

jest: https://www.npmjs.com/package/jest

jest-extended: https://www.npmjs.com/package/jest-extended

pg: https://www.npmjs.com/package/pg

pg-format: https://www.npmjs.com/package/pg-format

SuperTest: https://www.npmjs.com/package/supertest

jest-sorted: https://www.npmjs.com/package/jest-sorted

Minimum node.js version 16.15.0
Minimum Postgres version 8.7.3



3. Create .env files

Create a .env.development and a .env.test file. Into each add PGDATABASE='database_name_here' with the correct database name for that environment (see /db/setup.sql for the database names).



4. Seed the database

There are scripts included to set up and seed the database:

 - Set up the database - npm run setup-dbs
 - Seed the database - npm run seed



5. Run tests

To run the tests, use the following command:

- npm test



6. Committing changes

Before committing changes, use the following command to check that all the tests pass:

- npm run prepare

