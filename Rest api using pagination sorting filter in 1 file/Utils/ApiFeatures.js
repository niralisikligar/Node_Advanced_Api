class Apifeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        let queryString = JSON.stringify(this.queryStr)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        const queryObj = JSON.parse(queryString)
        console.log("-->", queryObj)

        this.query = this.query.find(queryObj);

        return this;

        // let query = Movie.find(
        //   queryObj.sort || queryObj.fields || queryObj.page || queryObj.limit
        //     ? {}
        //     : queryObj
        // )

    }
}

module.exports = Apifeatures;