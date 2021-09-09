const { Customer, validateCustomer } = require("../models/customer");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  let customer = await Customer.find({
    id: req.params.id,
  });
  if (!customer) res.status(404).send("Customer with given id not found");
  else res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message + "hello");
  console.log(req.body.movies);
  let customer = await new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
    movies: req.body.movies,
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let movies = req.body.movies.filter();
  let customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
      movies: req.body.movies,
    },
    {
      new: true,
    }
  );
  if (!customer) {
    res.status(404).send("customer with given id not found");
    return;
  }

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  let customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    res.status(404).send("customer with given id not found");
    return;
  }

  res.send(customer);
});

router.delete("/:cid/:mid", async (req, res) => {
  console.log(req.params.mid, req.param.cid);
  let customer = await Customer.findById(req.params.cid);

  if (customer) {
    customer.movies.pull(req.params.mid);
    // console.log(customer.movies.pull(req.params.mid));
  }
  await customer.save();
  res.send(customer.movies);
});

module.exports = router;
