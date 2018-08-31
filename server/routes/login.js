const express = require('express'),
      app = express(),
      User = require('../models/user'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      { OAuth2Client } = require('google-auth-library'),
      client = new OAuth2Client(process.env.CLIENT_ID);


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

// Google config
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    image: payload.picture,
    google: true
  };
}

app.post('/google', async (req, res) => {
  let token = req.body.idtoken;
  // console.log(token);
  let googleUser = await verify(token).catch((err) => {
    return res.status(403).json({
      ok: false,
      err
    });
  });

  User.findOne({email: googleUser.email}, (err, userDB) => {
    if (err) {
      return res.status(500).json({
          ok: false,
          err
      });
    }
    if (userDB) {
      if (!userDB.google) {
        return res.status(400).json({
            ok: false,
            err: {
              message: "User already exists"
            }
        });
      } else { // User authenticate with google
        let token = jwt.sign({
          user: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRES });

        return res.json({
          ok: true,
          user: userDB,
          token
        });
      }
    } else { // New user
      console.log("hola");
      let user = new User();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.image = googleUser.image;
      user.google = true;
      user.password = 'secret';

      user.save((err, new_user) => {
        if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
        }

        let token = jwt.sign({
          user: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRES });

        return res.json({
          ok: true,
          user: new_user,
          token
        });

      });
    }

  });

});

module.exports = app;
