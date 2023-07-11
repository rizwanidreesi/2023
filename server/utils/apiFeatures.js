class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            },
            // studentName: {
            //     $regex: this.queryStr.keyword,
            //     $options: 'i'
            // },
            admissionNo: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            },

        } : {};

        // console.log(keyword)
        this.query = this.query.find({ ...keyword });
        return this;
    }
    // search on student table cClass
    // cClass() {
    //     const keyword = this.queryStr.keyword ? {
    //         cClass: {
    //             $regex: this.queryStr.keyword,
    //             $options: 'i'
    //         }

    //     } : {}

    //     this.query = this.query.find({ ...keyword });
    //     return this;
    // }

    // End Search

    filter() {
        const queryCopy = { ...this.queryStr }

        // removing fields from query
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el]);

        // advanced filtering for price and others
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resPerPage) {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || resPerPage;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports = APIFeatures;


// class APIFeatures {
//     constructor(query, queryString) {
//         this.query = query;
//         this.queryString = queryString;
//     }

//     filter() {
//         const queryObj = { ...this.queryString };
//         const excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el]);

//         // 1B) Advanced Filtering
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//         this.query = this.query.find(JSON.parse(queryStr));

//         return this;
//     }

//     sort() {
//         if (this.queryString.sort) {
//             const sortBy = this.queryString.sort.split(',').join(' ');
//             this.query = this.query.sort(sortBy);
//         } else {
//             this.query = this.query.sort('-createdAt');
//         }

//         return this;
//     }

//     limitFields() {
//         if (this.queryString.fields) {
//             const fields = this.queryString.fields.split(',').join(' ');
//             this.query = this.query.select(fields);
//         } else {
//             this.query = this.query.select('-__v');
//         }

//         return this;
//     }

//     paginate() {
//         const page = this.queryString.page * 1 || 1;
//         const limit = this.queryString.limit * 1 || 100;
//         const skip = (page - 1) * limit;

//         this.query = this.query.skip(skip).limit(limit);

//         return this;
//     }
// }

// module.exports = APIFeatures;