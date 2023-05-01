
const fs = require("fs")
const Movie = require('./../Models/movieModel')
let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

exports.checkId = (req,res,next,value) => {
    console.log('Move ID is' + value);

    // find movie based on id parameter
    let movie = movies.find((el) => el.id === value * 1)

    if (!movie) {
      return res.status(404).json({
        status: "fail",
        message: "movie with id" + value + "is not found",
      })
    }

    next()
}

exports.validateBody = (req,res,next) => {
  if(!req.body.name || !req.body.releaseYear) {
   return res.status(400).json({
      status: "fail",
      message: 'Not a valid movie data'
    })
  }
  next();
}

// get - api/movies
exports.getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies: movies,
    },
  })
}

// get - api/movies/id
exports.getMovie = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1
  let movie = movies.find((el) => el.id === id)

//   if (!movie) {
//     return res.status(404).json({
//       status: "fail",
//       message: "movie with id" + id + "is not found",
//     })
//   }
  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  })
  // res.send('Test movie')
}

// post - api/movies
exports.createMovie = (req, res) => {
  // console.log(req.body);
  const newId = movies[movies.length - 1].id + 1
  const newMovie = Object.assign({ id: newId }, req.body)
  movies.push(newMovie)
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    })
  })
  // res.send('Created');
}

// patch - api/movies
exports.updateMovie = (req, res) => {
  let id = req.params.id * 1
  let movieToUpdate = movies.find((el) => el.id === id)

//   if (!movieToUpdate) {
//     return res.status(404).json({
//       status: "fail",
//       message: "No movie object with Id" + id + "is found",
//     })
//   }

  let index = movies.indexOf(movieToUpdate)
  Object.assign(movieToUpdate, req.body)

  movies[index] = movieToUpdate
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(200).json({
      status: "success",
      data: {
        movie: movieToUpdate,
      },
    })
  })
}
// delete - api/movies
 exports.deleteMovie = (req, res) => {
  const id = req.params.id * 1
  const movieToDelete = movies.find((el) => el.id === id)

//   if (!movieToDelete) {
//     return res.status(404).json({
//       status: "fail",
//       message: "No movie object with Id" + id + "is found to delete",
//     })
//   }

  const index = movies.indexOf(movieToDelete)

  movies.splice(index, 1)
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(204).json({
      status: "success",
      data: {
        movie: null,
      },
    })
  })
}