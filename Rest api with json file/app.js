// import package
const { application } = require("express")
const express = require("express")
// const fs = require("fs")
const morgan = require("morgan")

const moviesRouter = require("./Routes/moviesRoute")

let app = express()

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
  const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
})

app.use((error, req,res,next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error'
  res.status(error.statusCode).json({
    status:error.statusCode,
    message: error.message
  })
})

module.exports = app
