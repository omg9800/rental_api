const Joi = require("joi");
const mongoose = require("mongoose");

const deleteSchema = new mongoose.Schema({
  customerId: { type: String, required: true, minlength: 5, maxlength: 30 },
  movieId: { type: String, required: true, minlength: 5, maxlength: 30 },
});

const Deletemovie = mongoose.model("Deletemovie", deleteSchema);

function validateGenre(genre) {
  const schema = {
    customerId: Joi.string().min(5).max(30).required(),
    movieId: Joi.string().min(5).max(30).required(),
  };

  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
