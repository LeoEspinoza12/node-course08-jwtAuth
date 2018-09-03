const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Dishes = require('../models/schema')

const dishRouter = express.Router()

const authenticate = require('../authenticate');

dishRouter.use(bodyParser.json())

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
dishRouter.route('/')
.get((req, res, next) => {
  Dishes.find({})
    .then((dishes)=>{
      res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
          res.json(dishes)
    }, (err) => next(err))
    .catch((err)=> next(err));
})

// by simply adding the authenticate.verifyUser
// we can easily authenticate any post activity requested by the user
.post(authenticate.verifyUser, (req, res, next) => {
  Dishes.create(req.body)
    .then((dish) => {
      res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
          res.json(dish)
      console.log('New Dish is created \n', dish, '\n')
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403
  res.end(`PUT operation is not supported in dishes`)
})
.delete(authenticate.verifyUser, (req, res, next) => {
  Dishes.remove({})
    .then((resp) => {
      res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
          res.json(resp)
      // res.end(`All dishes are deleted`)
    }, (err) => next(err))
    .catch((err) => next(err))
});

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
dishRouter.route('/:dishId')
.get((req, res, next) => {
  Dishes.findById(req.params.dishId )
    .then((dish) => {
        res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
            res.json(dish)
        // console.log('New Dish is created', dish, '\n')
      }, (err) => next(err))
      .catch((err) => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403
    res.end(`POST operation is not supported on ${req.params.dishId}`)
})
.put(authenticate.verifyUser, (req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})  
    .then((dish) => {
        res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
            res.json(dish)
        // console.log('New Dish is created', dish, '\n')
      }, (err) => next(err))
      .catch((err) => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
  Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
            res.json(resp)
        // res.end(`All dishes are deleted`)
      }, (err) => next(err))
      .catch((err) => next(err))
})

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
dishRouter.route('/:dishId/comments')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if(dish != null){
          res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
              res.json(dish.comments)
        } else {
          err = new Error('\nDish ' + req.params.dishId + ' not found.\n')
            err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          dish.comments.push(req.body);
            dish.save()
          .then((dish)=>{
            res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }, err => next(err));
          res.json(dish.comments)
        } else {
          err = new Error('\nDish ' + req.params.dishId + ' not found.\n')
            err.status = 404;
              return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(`\nPUT operation is not supported in dishes` + req.params.dishId + '/comments')
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
      if (dish != true) {
        for (var i = (dish.comments.length -1); i >= 0; i--){
          dish.comments.id(dish.comments[i]._id).remove();
        }
         dish.save()
           .then((dish) => {
             res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
           }, err => next(err));
      } else {
        err = new Error('\nDish ' + req.params.dishId + ' not found.\n')
          err.status = 404;
            return next(err)
      }
        // res.end(`All dishes are deleted`)
    }, (err) => next(err))
    .catch((err) => next(err))
  });


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
dishRouter.route('/:dishId/comments/:commentId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
              res.json(dish.comments.id(req.params.commentId));
        } else if (dish == null) {
          err = new Error('\nDish ' + req.params.dishId + ' not found.\n')
            err.status = 404;
              return next(err);
        } else {
          err = new Error('\nComment ' + req.params.commentId + ' not found.\n')
            err.status = 404;
              return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
      res.end(`POST operation is not supported on /dishes ${req.params.dishId} /comments/ ${req.params.commentId}`)
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          if(req.body.rating){
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if(req.body.comment){
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish.save()
            .then((dish)=> {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
            }, (err) => next (err));

        } else if (dish == null) {
          err = new Error('\nDish ' + req.params.dishId + ' not found.\n')
            err.status = 404;
              return next(err);
        } else {
          err = new Error('\nComment ' + req.params.commentId + ' not found.\n')
            err.status = 404;
              return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
   Dishes.findById(req.params.dishId)
     .then((dish) => {
       if (dish != null && dish.comments.id(req.params.commentId) != null) {
         dish.comments.id(req.params.commentId).remove();
         dish.save()
           .then((dish) => {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(dish.comments);
           }, err => next(err));
       } else if (dish == null) {
         err = new Error('\nDish ' + req.params.dishId + ' not found.\n')
         err.status = 404;
         return next(err);
       } else {
         err = new Error('\nComment ' + req.params.commentId + ' not found.\n')
         err.status = 404;
         return next(err);
       }
       // res.end(`All dishes are deleted`)
     }, (err) => next(err))
     .catch((err) => next(err))
  })



module.exports = dishRouter;