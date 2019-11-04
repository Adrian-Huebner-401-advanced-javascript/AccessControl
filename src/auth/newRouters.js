'use strict';

const express = require('express');
const authRouter = express.Router();

const users = require('./users-model');
const auth = require('./middleware');
const oauth = require('./oauth/google');

// visiible to everyone
authRouter.get('/public-stuff', (req, res, next) => {
  res.send('everyone can see this page');
});

// require a valid login
authRouter.get('/hidden-stuff', (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

// should require READ capability in role (use middleware)
authRouter.get('/something-to-read', auth('read'), (req, res, next) => {
  req.can(auth('read'))
    .then(function () {
      res.send('You have something to read')
    })
    .catch(next)
});

// should require CREATE capability in role (use middleware)
authRouter.post('/create-a-thing', auth('create'), (req, res, next) => {
  req.can(auth('create'))
    .then(function () {
      res.send('You are creating something')
    })
    .catch(next)
});

// should require UPDATE capability in role (use middleware)
authRouter.put('/update', auth('update'), (req, res, next) => {
  req.can(auth('update'))
    .then(function () {
      res.send('You are updating something')
    })
    .catch(next)
});

// should require DELETE capability in role (use middleware)
authRouter.delete('/bye-bye', auth('delete'), (req, res, next) => {
  req.can(auth('delete'))
    .then(function () {
      res.send('You are deleting something')
    })
    .catch(next)
});

// should require SUPERUSER capability in role (use middleware)
authRouter.get('/everything', auth('create', 'update', 'delete'), (req, res, next) => {
  req.can(auth('create', 'update', 'delete'))
    .then(function () {
      res.send('You can do everthing')
    })
    .catch(next)
});