const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const lifeCyclePackages = require('../models/lifeCyclePackages');
const cors = require('./cors');
const lifeCycleRouter = express.Router();

lifeCycleRouter.use(bodyParser.json());

lifeCycleRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    lifeCyclePackages.find(req.query)
    .then((lifeCyclePackages) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lifeCyclePackages);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.create(req.body)
    .then((lifeCycle) => {
        console.log('lifeCycle Created ', lifeCycle);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lifeCycle);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /lifeCyclePackages');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

lifeCycleRouter.route('/:lifeCycleId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    lifeCyclePackages.findById(req.params.lifeCycleId)
    .then((lifeCycle) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lifeCycle);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /lifeCyclePackages/'+ req.params.lifeCycleId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.findByIdAndUpdate(req.params.lifeCycleId, {
        $set: req.body
    }, { new: true })
    .then((lifeCycle) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lifeCycle);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.findByIdAndRemove(req.params.lifeCycleId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

lifeCycleRouter.route('/:lifeCycleId/packages')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    lifeCyclePackages.findById(req.params.lifeCycleId)
    .then((lifeCycle) => {
        if (lifeCycle != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(lifeCycle.packages);
        }
        else {
            err = new Error('lifeCycle ' + req.params.lifeCycleId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.findById(req.params.lifeCycleId)
    .then((lifeCycle) => {
        if (lifeCycle != null) {
            lifeCycle.packages.push(req.body);
            lifeCycle.save()
            .then((lifeCycle) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(lifeCycle);                
            }, (err) => next(err));
        }
        else {
            err = new Error('lifeCycle ' + req.params.lifeCycleId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /lifeCyclePackages/'
        + req.params.lifeCycleId + '/packages');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.findById(req.params.lifeCycleId)
    .then((lifeCycle) => {
        if (lifeCycle != null) {
            for (var i = (lifeCycle.packages.length -1); i >= 0; i--) {
                lifeCycle.packages.id(lifeCycle.packages[i]._id).remove();
            }
            lifeCycle.save()
            .then((lifeCycle) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(lifeCycle);                
            }, (err) => next(err));
        }
        else {
            err = new Error('lifeCycle ' + req.params.lifeCycleId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

lifeCycleRouter.route('/:lifeCycleId/packages/:packageId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    lifeCyclePackages.findById(req.params.lifeCycleId)
    .then((lifeCycle) => {
        if (lifeCycle != null && lifeCycle.packages.id(req.params.packageId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(lifeCycle.packages.id(req.params.packageId));
        }
        else if (lifeCycle == null) {
            err = new Error('lifeCycle ' + req.params.lifeCycleId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('package ' + req.params.packageId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /lifeCyclePackages/'+ req.params.lifeCycleId
        + '/packages/' + req.params.packageId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.findById(req.params.lifeCycleId)
    .then((lifeCycle) => {
        if (lifeCycle != null && lifeCycle.packages.id(req.params.packageId) != null) {
            if (req.body.rating) {
                lifeCycle.packages.id(req.params.packageId).rating = req.body.rating;
            }
            if (req.body.package) {
                lifeCycle.packages.id(req.params.packageId).package = req.body.package;                
            }
            lifeCycle.save()
            .then((lifeCycle) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(lifeCycle);                
            }, (err) => next(err));
        }
        else if (lifeCycle == null) {
            err = new Error('lifeCycle ' + req.params.lifeCycleId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('package ' + req.params.packageId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
    lifeCyclePackages.findById(req.params.lifeCycleId)
    .then((lifeCycle) => {
        if (lifeCycle != null && lifeCycle.packages.id(req.params.packageId) != null) {
            lifeCycle.packages.id(req.params.packageId).remove();
            lifeCycle.save()
            .then((lifeCycle) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(lifeCycle);                
            }, (err) => next(err));
        }
        else if (lifeCycle == null) {
            err = new Error('lifeCycle ' + req.params.lifeCycleId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('package ' + req.params.packageId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = lifeCycleRouter;