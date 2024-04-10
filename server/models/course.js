const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseName: { type: String },
    courseDescription: { type: String },
    whatYouWillLearn: {
        type: String,
    },
    instructor: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: "user",
    },
    ratingAndReviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "ratingAndReview",
        },
    ],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    // tag: {
    //     type: [String],
    //     required: true,
    // },
    category: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: "category",
    },
    courseContent: [
        {
            type: Schema.Types.ObjectId,
            ref: "courseContent",
        },
    ],
    studentsEnrolled: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    ],
    instructions: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Virtual for sold
CourseSchema.virtual("sold").get(function () {
    return this.studentsEnrolled.length;
});

module.exports = mongoose.model("Course", CourseSchema);