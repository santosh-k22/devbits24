const RatingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
// const { mongo, default: mongoose } = require("mongoose");

// CREATE Rating
exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        // Check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }

        // Check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course is already reviewed by the user",
            });
        }

        // Create rating and review
        const ratingAndReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });

        // Update course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingAndReview._id,
                },
            },
            { new: true }
        );
        console.log(updatedCourseDetails);

        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingAndReview,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// GET course Average Rating
exports.getAverageRating = async (req, res) => {
    try {
        const courseId = req.body.courseId;

        // TODO : Understand clearly how this works
        // Calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: courseId,
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ]);

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // If course is unrated
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0, no ratings given till now",
            averageRating: 0,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// GET All rating and reviews
exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message, 
        });
    }
};

// UPDATE 
exports.updateRating = async (req, res) => {
	try {
        const userId = req.user.id;
        const { rating, review, ratingId } = req.body;

        // Check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: ratingId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }

        // find and update rating
		const updatedRating = await RatingAndReview.findByIdAndUpdate(
			ratingId,
			{ rating, review },
			{ new: true }
		).exec();
        if (!updatedRating) {
            return res.status(404).json({
                success: false,
                message: "Rating and review not found",
            });
        }

		res.status(200).json({
			success: true,
			message: "Rating and review updated",
			data: updatedRating,
		});
	} catch (err) {
		// console.error("Error updating Rating and review:", err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
            error: err.message,
		});
	}
};

// DELETE Rating
exports.deleteRating = async (req, res) => {
	try {
        const { ratingId, courseId } = req.body;
		const deletedRating = await RatingAndReview.findByIdAndDelete(ratingId).exec();

        // Delete rating from course
		const updatedCourse = await Course.findByIdAndUpdate(
			{
				_id: courseId,
			},
			{
				$pull: {
					ratingAndReviews: ratingId,
				},
			},
			{
				new: true,
			}
		).exec();

		res.status(200).json({
			success: true,
			message: "Rating deleted",
			data: deletedRating,
            updatedCourse: updatedCourse,
		});
	} catch (err) {
		console.error("Error deleting Rating:", err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
            error: err.message,
		});
	}
};