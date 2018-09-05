const express = require('express'),
      app = express(),
      { verifyToken, verifyAdmin } = require('../middlewares/auth'),
      Category = require('../models/category');

app.get('/categories', verifyToken, (req, res) => {

  Category.find({})
          .sort('description')
          .populate('user', 'name email')
          .exec((err, categoryDB) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!categoryDB) {
        return res.status(400).json({
            ok: false,
            err: {
              message: "Categories couldn't be find"
            }
        });
    }

    res.json({
        ok: true,
        category: categoryDB
    });
  });
});

app.get('/categories/:id', verifyToken, (req, res) => {
  let id = req.params.id;

  Category.findById(id, (err, categoryDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!categoryDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "Category couldn't be find"
              }
          });
      }

      res.json({
          ok: true,
          category: categoryDB
      });
  });
});

app.post('/categories', verifyToken, (req, res) => {
  let category = new Category({
      description: req.body.description,
      user: req.user._id
  });

  category.save((err, categoryDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!categoryDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "Category couldn't be created"
              }
          });
      }

      res.json({
          ok: true,
          category: categoryDB
      });
  });
});

app.put('/categories/:id', verifyToken, (req, res) => {
  // Update a new category
  let id = req.params.id;

  Category.findByIdAndUpdate(id, { description: req.body.description } , { new: true } , (err, categoryDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!categoryDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "Category couldn't be updated"
              }
          });
      }
      res.json({
          ok: true,
          category: categoryDB
      });
  });
});

app.delete('/categories/:id', [verifyToken, verifyAdmin], (req, res) => {
  let id = req.params.id;

  Category.findByIdAndRemove(id, (err, categoryDB) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!categoryDB) {
        return res.status(400).json({
            ok: false,
            message: 'User not found'
        });
    }

    res.json({
        ok: true,
        category: categoryDB
    });
  });
});


module.exports = app;
