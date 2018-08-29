const express = require('express'),
      app = express(),
      User = require('../models/user'),
      bcrypt = require('bcrypt'),
      _ = require('underscore'),
      { verifyToken, verifyAdmin } = require('../middlewares/auth');

app.get('/users', verifyToken, (req, res) => {
  let from = Number(req.query.from) || 0,
      limit = Number(req.query.limit) || 5;

    User.find({'state': true}, 'name email state')
        .limit(limit)
        .skip(from)
        .exec((err, users) => {
          if (err) {
              return res.status(400).json({
                  ok: false,
                  err
              });
          }
          User.count({'state': true}, (err, count) => {
            res.json({
              ok: true,
              users,
              count
            });
          });
        });
});

app.post('/users', [verifyToken, verifyAdmin], (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/users/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'lastname', 'email', 'img', 'role', 'state']);
    let ops = {
        new: true,
        runValidators: true
    };

    User.findByIdAndUpdate(id, body, ops, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/users/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let body = {'state': false};
    let ops = {new: true};

    User.findByIdAndUpdate(id, body, ops, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/users/deleteCompletly/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) => {
      if (err) {
          return res.status(400).json({
              ok: false,
              err
          });
      }

      if (!deletedUser) {
          return res.status(400).json({
              ok: false,
              message: 'User not found'
          });
      }

      res.json({
          ok: true,
          user: deletedUser
      });
    });
});

module.exports = app;
