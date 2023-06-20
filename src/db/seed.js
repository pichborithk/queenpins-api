const { db } = require('../config/default');

async function dropTables() {
  try {
    console.log('Dropping All Tables...');

    await db.query(`

    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS photos;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    DROP TYPE IF EXISTS user_type;

    `);

    console.log('Finished dropping tables!');
  } catch (error) {
    console.error('Error while dropping tables!');
  }
}

async function buildTables() {
  try {
    console.log('Starting to construct tables...');

    await db.query(`
      CREATE TYPE user_type AS ENUM ('user', 'admin');

      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255)  NOT NULL,
        type user_type DEFAULT 'user' NOT NULL
      );

      CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT  NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        quantity INTEGER DEFAULT 0
      );

      CREATE TABLE photos(
        id SERIAL PRIMARY KEY,
        url text UNIQUE NOT NULL,
        "productId" INTEGER REFERENCES products(id)
      );

      CREATE TABLE reviews(
        id SERIAL PRIMARY KEY,
        content text UNIQUE NOT NULL,
        "productId" INTEGER REFERENCES products(id),
        "userId" INTEGER 	REFERENCES users(id)
      );

      CREATE TABLE carts(
        id SERIAL PRIMARY KEY,
        quantity INTEGER NOT NULL,
        "productId" INTEGER REFERENCES products(id),
        "userId" INTEGER 	REFERENCES users(id),
        UNIQUE ("productId", "userId")
      );
    `);

    console.log('Finished constructing tables!');
  } catch (error) {
    console.error('Error constructing tables!');
  }
}

async function rebuildDatabase() {
  try {
    await dropTables();
    await buildTables();
  } catch (error) {
    console.log('Error during rebuildDB');
    throw error;
  }
}

module.exports = {
  rebuildDatabase,
};
