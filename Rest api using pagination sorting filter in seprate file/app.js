// import package
const { application } = require("express")
const express = require("express")
const multer = require("multer")
const cors = require("cors")
// const fs = require("fs")
const morgan = require("morgan")

const moviesRouter = require("./Routes/moviesRoute");
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')

let app = express()

app.use(cors()) // Allows incoming requests from any IP

// Start by creating some disk storage options:
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads")
  },
  // Sets file(s) to be saved in uploads folder in same directory
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  },
  // Sets saved filename(s) to be original filename(s)
})

// Set saved storage options:
const upload = multer({ storage: storage })

app.post("/api", upload.single("uploaded_file"), (req, res) => {
  // Sets multer to intercept files named "files" on uploaded form data


  // multi file upload
  // console.log(req.body) // Logs form body values
  // console.log(req.files) // Logs any files


  // for single file
  console.log(req.file, req.body)
  res.json({ message: "File(s) uploaded successfully" })
})

const logger = function (req, res, next) {
  console.log("custom middleware called")
  next()
}

app.use(express.json())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.static("./public"))
app.use(logger)
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString()
  next()
})

// using routes
app.use("/api/v1/movies", moviesRouter)
app.all('*', (req,res,next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server`
  // })
  // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new CustomError(`Cant't find ${req.originalUrl} on the server!`, 404)
  next(err);
})

app.use(globalErrorHandler)


module.exports = app
