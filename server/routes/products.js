const express = require('express'),
      app = express(),
      { verifyToken } = require('../middlewares/auth'),
      _ = require('underscore'),
      Product = require('../models/product');

app.get('/products', verifyToken, (req, res) => {
  let from = Number(req.query.from) || 0,
      limit = Number(req.query.limit) || 5;

  Product.find({ state: true })
          .sort('description')
          .limit(limit)
          .skip(from)
          .populate('user', 'name email')
          .populate('category', 'description')
          .exec((err, productDB) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!productDB) {
        return res.status(400).json({
            ok: false,
            err: {
              message: "Product couldn't be found"
            }
        });
    }

    res.json({
        ok: true,
        product: productDB
    });
  });
});

app.get('/products/:id', verifyToken, (req, res) => {
  let id = req.params.id;

  Product.findById(id)
         .populate('user', 'name email')
         .populate('category', 'description')
         .exec((err, productDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!productDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "Product couldn't be found"
              }
          });
      }

      res.json({
          ok: true,
          product: productDB
      });
  });
});

app.get('/products/search/:word', verifyToken, (req, res) => {
  let word = req.params.word;
  let regexp = new RegExp(word, 'i');

  Product.find({ name: regexp })
         .populate()
         .populate('category', 'description')
         .exec((err, productDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!productDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "Product couldn't be found"
              }
          });
      }

      res.json({
          ok: true,
          product: productDB
      });
  });
});

app.post('/products', verifyToken, (req, res) => {
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    user: req.user._id
  });

  product.save((err, productDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!productDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "Product couldn't be created"
              }
          });
      }

      res.status(201).json({
          ok: true,
          product: productDB
      });
  });
});

app.put('/products/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'price', 'description', 'category', 'state']);
  let ops = {new: true};

  Product.findByIdAndUpdate(id, body, ops, (err, productDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!productDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "Product couldn't be updated"
              }
          });
      }

      res.json({
          ok: true,
          product: productDB
      });
  });
});

app.delete('/products/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = {'state': false};
  let ops = {new: true};

  Product.findByIdAndUpdate(id, body, ops, (err, productDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!productDB) {
          return res.status(400).json({
              ok: false,
              message: 'Product not found'
          });
      }
      res.json({
          ok: true,
          product: productDB
      });
  });
});


module.exports = app;
