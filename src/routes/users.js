const jwt = require('jsonwebtoken');
const express = require('express');

const { getUserByEmail, getUser, createUser } = require('../db/users');
const deserializeUser = require('../middleware/deserializeUser');

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
      message: 'Thank you for signing up',
      data: {
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
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
      // expiresIn: '1w',
    });

    res.status(200).json({
      success: true,
      message: "You're logged in!",
      error: null,
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', deserializeUser, async (req, res, next) => {
  if (!req.user) {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be an admin to perform this action',
    });
  }

  try {
    const { id, email, name, type } = req.user;

    res.status(200).json({
      success: true,
      message: `Success fetch user information`,
      error: null,
      data: {
        id,
        email,
        name,
        type,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
