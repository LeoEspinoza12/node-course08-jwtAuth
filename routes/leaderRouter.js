const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const Leaders = require('../models/leaders')

const leaderRouter = express.Router()
leaderRouter.use(bodyParser.json())

const authenticate = require('../authenticate');


leaderRouter.route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
        console.log('New Leader is created \n', leader, '\n')
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(`PUT operation is not supported for Leaders`)
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  });


leaderRouter.route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(`POST operation is not supported on ${req.params.leaderId}`)
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = leaderRouter;