const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
const app = require("./app")

// console.log(app.get('env'));
// console.log(process.env);

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

// const testMovie = new Movie({
//     name: "Die hard test",
//     description: "test test test",
//     duration: 140,
//     ratings:4.0
// })

// testMovie.save()
// .then(doc => {
//   console.log(doc);
// })
// .catch(err => {
//   console.log("Error occured:" + err);
// })

// create server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log("server has started....")
})
