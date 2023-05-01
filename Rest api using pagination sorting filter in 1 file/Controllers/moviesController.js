const Movie = require("./../Models/movieModel")
// let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

// get - api/movies
exports.getAllMovies = async (req, res) => {
  try {
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

    let queryStr = JSON.stringify(req.query)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    const queryObj = JSON.parse(queryStr)
    console.log("-->", queryObj)

    let query = Movie.find(
      queryObj.sort || queryObj.fields || queryObj.page || queryObj.limit
        ? {}
        : queryObj
    )

    // sorting logic

    // sorting Query==> localhost:3000/api/v1/movies/?sort=-releaseYear,ratings
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      // console.log(sortBy);
      query = query.sort(sortBy)
      // console.log("1111---->",query);
    } else {
      query = query.sort("-createdAt")
      // console.log("2222---->",query);
    }

    // limiting fields
    if (req.query.fields) {
      // query.select('name duration price ratings')
      const fields = req.query.fields.split(",").join(" ")
      // query.select(fields);
      console.log(fields)
      // query = query.select(fields);
      query = query.select(fields)
      // console.log("query==>",query);
    } else {
      query = query.select("-__v")
    }

    // pagination logic
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    // page1:1-5, page2: 6-10, page3: 11-15
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const moviesCount = await Movie.countDocuments()
      if (skip >= moviesCount) {
        throw new Error(" This page is not found!")
      }
    }

    let movies = await query

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
    res.status(400).json({
      status: "fail",
      message: "something went wrong",
    })
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
