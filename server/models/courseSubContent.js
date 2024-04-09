const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSubContentSchema = new Schema({
	title: { type: String },
	timeDuration: { type: String },
    videoUrl: { type: String },
	description: { type: String },
});

module.exports = mongoose.model("CourseSubContent", CourseSubContentSchema);