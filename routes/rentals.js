const Fawn = require("fawn");
const Joi = require("joi");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  let rental = await Rental.find({
    id: req.params.id,
  });
  if (!rental) res.status(404).send("Rental with given id not found");
  else res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const c = await Customer.findById(req.body.customerId);
  var mov;
  if (c) {
    //console.log(c);
    mov = [...c.movies];
    mov.push(movie._id);
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .update(
        "customers",
        { _id: customer._id },
        {
          movies: mov,
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
