const config = require("config");
const jwt = require("jsonwebtoken");

const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, name: this.name },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("Users", userSchema);

function validateUsers(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(user, schema);
}

exports.validateUsers = validateUsers;
exports.User = User;
