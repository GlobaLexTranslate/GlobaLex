const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    username: String,
    // Add other fields as needed
});

module.exports = mongoose.model('User', userSchema);
 