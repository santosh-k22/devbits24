const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseContentSchema = new Schema({
	courseContentName: {
		type: String,
	},
    // ref to courseSubContent
	courseSubContent: [
		{
			type: Schema.Types.ObjectId,
			required: true,
			ref: "courseSubContent",
		},
	],
});

module.exports = mongoose.model("CourseContent", CourseContentSchema);