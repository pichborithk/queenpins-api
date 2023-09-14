require('dotenv').config();
const bcrypt = require('bcrypt');

const { pool } = require('../config/default');

async function createUser({ email, name, password }) {
  const hash = await bcrypt.hash(password, Number(process.env.SALT));

  try {
    // const db = await pool.connect();
    // const { rows } = await db.query(
    const { rows } = await pool.query(
      `
        INSERT INTO users (email, name, password)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
      `,
      [email, name, hash]
    );
    // db.release(true);

    if (!rows || rows.length <= 0) {
      return null;
    }

    const user = rows[0];
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByEmail(email) {
  try {
    const db = await pool.connect();
    const { rows } = await db.query(
      `
        SELECT email
        FROM users
        WHERE email=$1
      `,
      [email]
    );
    db.release(true);

    if (rows.length > 0) {
      return rows[0];
    }

    return null;
  } catch (error) {
    console.error(error);
  }
}

async function getUser({ email, password }) {
  try {
    const db = await pool.connect();
    const { rows } = await db.query(
      `
        SELECT *
        FROM users
        WHERE email=$1
      `,
      [email]
    );
    db.release(true);

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(userId) {
  try {
    const db = await pool.connect();
    const { rows } = await db.query(
      `
      SELECT id, email, name, type
      FROM users
      WHERE id=$1
      `,
      [userId]
    );
    db.release(true);

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function updateUser({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`)
    .join(', ');

  try {
    const db = await pool.connect();
    const { rows } = await db.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=$1
        RETURNING *;
      `,
      [id, ...Object.values(fields)]
    );
    db.release(true);

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  getUser,
  getUserById,
  updateUser,
};
