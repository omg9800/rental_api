const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 30 },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
});

const Movie = mongoose.model("Movies", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).max(30).required(),
    genreId: Joi.objectId().min(3).max(30).required(),
    numberInStock: Joi.required(),
    dailyRentalRate: Joi.required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
