const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true,
            unique: true
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
        loginAttempts: {
            type: Number,
            required: true,
            default: 0
        },
        lockedAt:{
          type: Date 
        }
    }, { timestamps: true }

);


module.exports = mongoose.model('User', userSchema);

