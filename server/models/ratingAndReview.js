const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingAndReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
    course: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "course",
		index: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
});

// Export the RatingAndReview model
module.exports = mongoose.model("RatingAndReview", RatingAndReviewSchema);