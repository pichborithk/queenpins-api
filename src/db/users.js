require('dotenv').config();
const bcrypt = require('bcrypt');

const { db } = require('../config/default');

async function createUser({ email, name, password }) {
  const hash = await bcrypt.hash(password, Number(process.env.SALT));
  try {
    const { rows } = await db.query(
      `
        INSERT INTO users (email, name, password)
        VALUES ($1, $2, $3)
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

async function updateUser({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`)
    .join(', ');

  try {
    const { rows } = await db.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=$1
        RETURNING *;
      `,
      [id, ...Object.values(fields)]
    );

    const [user] = rows;
    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  updateUser,
};
