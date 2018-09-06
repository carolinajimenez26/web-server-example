const express = require('express'),
      fileUpload = require('express-fileupload'),
      app = express(),
      User = require('../models/user'),
      Product = require('../models/product'),
      fs = require('fs'),
      path = require('path');

// default options
app.use(fileUpload());

const deleteImage = (type, fileName) => {
  let imagePath = path.resolve(__dirname, `../../uploads/${ type }/${ fileName }`);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

const changeUserImage = async (id, fileName) => {
  
  let userDB = await User.findById(id).catch((err) => {
    throw Error(err);
  });

  let oldImage = userDB.image;
  userDB.image = fileName;

  let newUser = userDB.save().catch((err) => {
    throw Error(err);
  });

  deleteImage('users', oldImage);

  return newUser;
};

const changeProductImage = async (id, fileName) => {
  let productDB = await Product.findById(id).catch((err) => {
    throw Error(err);
  });

  let oldImage = productDB.image;
  
  productDB.image = fileName;

  let newProduct = productDB.save().catch((err) => {
    throw Error(err);
  });
  
  deleteImage('products', oldImage);

  return newProduct;
};
 
app.put('/upload/:type/:id', async (req, res) => {
  
  let type = req.params.type,
      id = req.params.id,
      validTypes = ['users', 'products'];
  
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
          message: 'No files were uploaded.'
      }
    });
  }

  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Valid types are ${validTypes.join(', ')}`
      }
    });
  }
 
  let file = req.files.file,
      fileName = file.name.split('.'),
      fileExt = fileName[fileName.length - 1],
      validExt = ['jpg', 'png', 'gif', 'jpeg'];
  
  if (validExt.indexOf(fileExt) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Valid extensions are ${validExt.join(', ')}`
      }
    });
  }

  let newFileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;
  let newUser, newProduct;

  if (type === 'users') {
    newUser = await changeUserImage(id, newFileName).catch((err) => {
      return res.status(403).json({
        ok: false,
        err
      });
    });
  } else {
    newProduct = await changeProductImage(id, newFileName).catch((err) => {
      return res.status(403).json({
        ok: false,
        err
      });
    });
  }

  if (newUser || newProduct) {
    file.mv(`./uploads/${type}/${newFileName}`, (err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
  
      return res.json({
        ok: true,
        message: 'File uploaded correctly',
        image: newFileName
      });
    });
  }
});

module.exports = app;