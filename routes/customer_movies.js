const Fawn = require("fawn");
const { Customer, validateCustomer } = require("../models/customer");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Fawn.init(mongoose);
router.put("/", async (req, res) => {
  //console.log(req.body);
  let customer = await Customer.findById(req.body.cid);

  for (let i = 0; i < customer.movies.length; i++) {
    if (customer.movies[i] === req.body.mid) {
      customer.movies.splice(i, 1);
      break;
    }
  }

  let movie = await Movie.findById(req.body.mid);
  movie.numberInStock = movie.numberInStock + 1;

  await customer.save();
  await movie.save();

  res.send(customer.movies);
});

module.exports = router;
