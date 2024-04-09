const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	courses: [
		{
			type: Schema.Types.ObjectId,
			ref: "course",
		},
	],
});

module.exports = mongoose.model("Category", CategorySchema);