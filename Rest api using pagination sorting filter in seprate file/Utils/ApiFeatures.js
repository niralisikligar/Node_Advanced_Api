class Apifeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    let queryString = JSON.stringify(this.queryStr)
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
    const queryObj = JSON.parse(queryString)
    console.log("-->", queryObj)

    this.query = this.query.find(queryObj.sort || queryObj.fields || queryObj.page || queryObj.limit
        ? {}
        : queryObj)

    return this

    // let query = Movie.find(
    //   queryObj.sort || queryObj.fields || queryObj.page || queryObj.limit
    //     ? {}
    //     : queryObj
    // )
  }

  sort() {
    // sorting logic
    // sorting Query==> localhost:3000/api/v1/movies/?sort=-releaseYear,ratings
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ")
      // console.log(sortBy);
      this.query = this.query.sort(sortBy)
      // console.log("1111---->",query);
    } else {
      this.query = this.query.sort("-createdAt")
      // console.log("2222---->",query);
    }
    return this
  }

  limitFields() {
    // limiting fields
    if (this.queryStr.fields) {
      // query.select('name duration price ratings')
      const fields = this.queryStr.fields.split(",").join(" ")
      // query.select(fields);
      console.log(fields)
      // query = query.select(fields);
      this.query = this.query.select(fields)
      // console.log("query==>",query);
    } else {
      this.query = this.query.select("-__v")
    }
    return this
  }

  paginate() {
    // pagination logic
    const page = this.queryStr.page * 1 || 1
    const limit = this.queryStr.limit * 1 || 5
    // page1:1-5, page2: 6-10, page3: 11-15
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)

    // if (this.queryStr.page) {
    //   const moviesCount = await Movie.countDocuments()
    //   if (skip >= moviesCount) {
    //     throw new Error(" This page is not found!")
    //   }
    // }

    return this
  }
}

module.exports = Apifeatures
