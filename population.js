const mongoose = require("mongoose");
const express = require("express");
const app = express();
// const genres = require("./routes/genres");
// const customers = require("./routes/customers");
const config = require("config");
const Joi = require("joi");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.log("Could not connect to mongodb"));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourse() {
  const courses = await Course.find();

  console.log(courses);
}

async function updateCourse(courseId) {
  // const course = await Course.findById(courseId);
  const course = await Course.update(
    { _id: courseId },
    {
      $set: {
        "author.name": "shyama",
      },
    }
  );
  // course.author.name = "omprakash";
  // course.save();
}

//createAuthor("Om", "student", "facebook");

// createCourse("nodejs", [
//   new Author({ name: "Mosh", bio: "student" }),
//   new Author({ name: "Mosham", bio: "teacher" }),
// ]);

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}
removeAuthor("61154eedf753083bb0aa32c3", "611552c72c6ca535dcb40d22");
//addAuthor("61154eedf753083bb0aa32c3", new Author({ name: "Munna" }));
//listCourse();
//updateCourse("61153e067734ed3bd8b88a14");
