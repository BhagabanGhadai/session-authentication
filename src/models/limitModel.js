const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var limitSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 180
      },
});

module.exports = mongoose.model('limit', limitSchema);