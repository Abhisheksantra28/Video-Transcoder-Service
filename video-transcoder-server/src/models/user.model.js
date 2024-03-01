const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Enforces unique emails
    lowercase: true, // Convert email to lowercase for consistency
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length (optional)
  },

},{timestamps:true});



// Ensure model is created only once
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;