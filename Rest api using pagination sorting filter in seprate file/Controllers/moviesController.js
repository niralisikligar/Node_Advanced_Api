const CustomError = require("../Utils/CustomError")
const Movie = require("./../Models/movieModel")
const Apifeatures = require("./../Utils/ApiFeatures")
// let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

// get - api/movies
exports.getAllMovies = async (req, res) => {
  try {
    const features = new Apifeatures(Movie.find(), req.query)
      .sort()
      .filter()
      .limitFields()
      .paginate()
    let movies = await features.query
    // mongoose 6.0 or less
    // console.log(req.query)
    // const excludeFields = ['sort', 'page', 'limit' , 'fields'];
    // const queryObj = {...req.query};

    // excludeFields.forEach((el)=>{
    //   delete queryObj[el]
    // })

    // console.log(queryObj);

    // const movies = await Movie.find(queryObj)

    // another way to filter data
    // const movies = await Movie.find()
    //   .where("duration")
    //   .equals(req.query.duration)
    //   .where("ratings")
    //   .equals(req.query.ratings)

    // mongoose 7.0 or more

    // console.log(req.query)

    // filter query===> localhost:3000/api/v1/movies/?duration[gte]=118&ratings[gte]=7

    // let movies = await query

    // const movies = await Movie.find(queryObj)

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies: movies,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}

// get - api/movies/id
exports.getMovie = async (req, res) => {
  // const movie = await Movie.find({_id: req.params.id});

  try {
    const movie = await Movie.findById(req.params.id)
    res.status(200).json({
      status: "success",
      // count: movies.length,
      data: {
        movie,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}

// post - api/movies
exports.createMovie = async (req, res) => {
  // const testMovie = new Movie({});
  // testMovie.save();
  try {
    const movie = await Movie.create(req.body)
    res.status(201).json({
      status: "success",
      data: {
        movie,
      },
    })
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message
    // })
    const error = new CustomError(err.message, 400);
    next(err);
  }
}

// patch - api/movies
exports.updateMovie = async (req, res) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: "success",
      data: {
        movie: updateMovie,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}
// delete - api/movies
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}

exports.getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([

      { $match: { ratings: { $gte: 6.8 } } },
      {
        $group: {
          _id: "$releaseYear",
          avgRatings: { $avg: "$ratings" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          priceTotal: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { minPrice: 1 } },
      { $match: { maxPrice: { $gte: 150 } } },
    ])

    res.status(200).json({
      status: "success",
      count: stats.length,
      data: {
        stats,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}

// use of $unwind
// Deconstructs an array field from the input documents to output a document
//  for each element. Each output document is the input document with
//  the value of the array field replaced by the element.

exports.getMovieByGenre = async (req, res) => {
  try {
    const genre = req.params.genre
    const movies = await Movie.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      {$addFields: {genre: "$_id"}},
      {$project: {_id: 0}},
      {$sort: {movieCount: -1}},
      // {$limit: 6}
      {$match: {genre : genre}}
    ])

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}
