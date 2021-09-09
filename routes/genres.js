const Joi = require("joi");
//const asyncMiddleware = require("../middlewares/async");
const auth = require("../middlewares/auth");
const adminauth = require("../middlewares/admin");
const { Genre, validateGenre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  //throw new Error("could not find the genres");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  let genre = await Genre.find({
    id: req.params.id,
  });
  if (!genre) res.status(404).send("Genre with given id not found");
  else res.send(genre);
});

router.post("/", auth, async (req, res) => {
  // console.log(req.body.name);
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = await new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );
  if (!genre) {
    res.status(404).send("genre with given id not found");
    return;
  }

  res.send(genre);
});

router.delete("/:id", [auth, adminauth], async (req, res) => {
  let genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    res.status(404).send("genre with given id not found");
    return;
  }

  res.send(genre);
});

module.exports = router;
