const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const Joi = require("joi");
const auth = require("../middlewares/auth");
const adminauth = require("../middlewares/admin");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().select("-__v").sort("title");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  let movie = await Movie.find({
    id: req.params.id,
  });
  if (!movie) res.status(404).send("movie with given id not found");
  else res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(403).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    {
      new: true,
    }
  );
  if (!movie) {
    res.status(404).send("movie with given id not found");
    return;
  }

  res.send(movie);
});

router.delete("/:id", [auth, adminauth], async (req, res) => {
  let movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) {
    res.status(404).send("movie with given id not found");
    return;
  }

  res.send(movie);
});

module.exports = router;
