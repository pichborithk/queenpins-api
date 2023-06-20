const jwt = require('jsonwebtoken');
const express = require('express');

const { getUserByEmail, getUser } = require('../db/users');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return next({
      name: 'MissingCredentialsError',
      message: 'Please supply all requirement',
    });
  }

  if (password.length < 8) {
    return next({
      name: 'MissingCredentialsError',
      message: 'Password Too Short!',
    });
  }

  try {
    const _user = await getUserByEmail(email);

    if (_user) {
      return next({
        name: 'UserExistsError',
        message: `User ${_user.email} is already in use.`,
      });
    }

    const user = await createUser({ email, name, password });

    if (!user || !user.id) {
      return next({
        name: 'Server fail',
        message: 'Fail to register user',
      });
    }

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
      // expiresIn: '1w',
    });

    res.status(200).json({
      success: true,
      error: null,
      message: 'thank you for signing up',
      data: {
        id: user.id,
        email,
        name,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a email and password',
    });
  }

  try {
    const user = await getUser({ email, password });
    if (!user || !user.id) {
      return next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      });
    }
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      // expiresIn: '1w',
    });

    res.status(200).json({
      success: true,
      message: `you're logged in!`,
      error: null,
      data: {
        id: user.id,
        email,
        name: user.name,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
