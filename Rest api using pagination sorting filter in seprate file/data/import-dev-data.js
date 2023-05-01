const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
const Movie = require("./../Models/movieModel")

dotenv.config({ path: "./config.env" })

// connect mongodb
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    // console.log(conn);
    console.log("db connected successfully")
  })
  .catch((error) => {
    console.log("error---->", error)
  })

//   read movies.json file

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"))

// delete existings movie documents from collection
const deleteMovie = async () => {
  try {
    await Movie.deleteMany()
    console.log("Data successfully deleted!")
  } catch (err) {
    console.log(err.message)
  }
}

// import movies data to mongodb collection
const importMovies = async () => {
  try {
    await Movie.create(movies)
    console.log("Data successfully imported!")
  } catch (err) {
    console.log(err.message)
  }
  process.exit()
}

// deleteMovie();
// importMovies();

// console.log(process.argv);

if (process.argv[2] === "--import") {
  importMovies()
}
if (process.argv[2] === "--delete") {
  deleteMovie()
}
