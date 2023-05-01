const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required field!"],
      unique:true
    },
    description: String,
    duration: {
      type: Number,
      required: [true, "Duration is required field!"],
    },
    ratings: {
      type: Number,
      default: 1.0,
    },
  })

  const Movie = mongoose.model("Model", movieSchema);

  module.exports = Movie;