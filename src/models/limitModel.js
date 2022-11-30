const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var limitSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "24h"
    }
});
limitSchema.index({ createdAt: 1 }, { expireAfterSeconds: "24h" })
module.exports = mongoose.model('limit', limitSchema);