const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'Description is needed']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Category', categorySchema);
