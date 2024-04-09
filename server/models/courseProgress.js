const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseProgressSchema = new Schema({
    courseID: {
        type: Schema.Types.ObjectId,
        ref: "course",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    completedVideos: [
        {
            type: Schema.Types.ObjectId,
            ref: "courseSubContent",
        },
    ],
})

module.exports = mongoose.model("CourseProgress", CourseProgressSchema)