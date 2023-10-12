require('dotenv').config();
// const { Client } = require('pg');

// const db = new Client(process.env.DATABASE_URL);

// const SERVER_PORT = Number(process.env.SERVER_PORT) || 1337;

// module.exports = {
//   db,
//   config: {
//     server: {
//       port: SERVER_PORT,
//     },
//   },
// };

const { Pool } = require('pg');

const pool = new Pool({
  // host: process.env.DATABASE_HOST,
  // user: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE_DB,
  // port: 5432,
  max: 20,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 20000,
  allowExitOnIdle: false,
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  pool,
};
