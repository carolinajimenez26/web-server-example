const express = require('express'),
      app = express(),
      User = require('../models/user'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  let body = req.body;
  User.findOne({email: body.email}, (err, userDB) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
    if (!userDB) {
        return res.status(400).json({
            ok: false,
            err: {
              message: "User or password incorrect"
            }
        });
    }
    if (!bcrypt.compareSync(body.password, userDB.password)) {
      return res.status(400).json({
          ok: false,
          err: {
            message: "User or password incorrect"
          }
      });
    }
    let token = jwt.sign({
      user: userDB
    }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRES }); // expires in 30 days
    // ms, min, hours, days

    res.json({
      ok: true,
      user: userDB,
      token
    });

  });
});

module.exports = app;
