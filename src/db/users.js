require('dotenv').config();
const bcrypt = require('bcrypt');

const { db } = require('../config/default');

async function createUser({ email, name, password }) {
  const hash = await bcrypt.hash(password, Number(process.env.SALT));

  try {
    const { rows } = await db.query(
      `
        INSERT INTO users (email, name, password)
        VALUES ($1, $2)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
      `,
      [email, name, hash]
    );

    if (!rows || rows.length <= 0) {
      return null;
    }

    const [user] = rows;
    delete user.password;
    delete user.type;
    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
};
