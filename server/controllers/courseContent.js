const CourseContent = require("../models/courseContent");
const Course = require("../models/course");
const CourseSubContent = require("../models/courseSubContent");

// CREATE
exports.createCourseContent = async (req, res) => {
	try {
		const { courseContentName, courseId } = req.body;

        // Return an error if the section name or course ID is empty
        if (!courseContentName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await CourseContent.create({ courseContentName });

        // Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			// .populate({
			// 	path: "courseContent",
			// 	populate: {
			// 		path: "courseSubContent",
			// 	},
			// })
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Course content created successfully",
			updatedCourse,
		});
	} catch (err) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
};

// UPDATE 
exports.updateCourseContent = async (req, res) => {
	try {
		const { courseContentName, courseContentId, courseId } = req.body;

        // find and update course content
		const courseContent = await CourseContent.findByIdAndUpdate(
			courseContentId,
			{ courseContentName },
			{ new: true }
		);

        // Return error if Course content is not found
		if(!courseContent) {
			return res.status(404).json({
				success:false,
				message:"Course content not Found",
			});
		};

        // find updated course
		const course = await Course.findById(courseId)
		// .populate({
		// 	path:"courseContent",
		// 	populate:{
		// 		path:"courseSubContent",
		// 	},
		// })
		.exec();

		res.status(200).json({
			success: true,
			message: courseContent,
			data: course,
		});
	} catch (err) {
		console.error("Error updating section:", err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
            error: err.message,
		});
	}
};

// DELETE 
exports.deleteCourseContent = async (req, res) => {
	try {
		const { courseContentId, courseId }  = req.body;

        // find and remove courseContent from course
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: courseContentId,
			}
		});

		const courseContent = await CourseContent.findById(courseContentId);

        // Return error if course content is not found
		if(!courseContent) {
			return res.status(404).json({
				success:false,
				message:"Course content not Found",
			});
		};

		// Delete all sub contents of Course content by matching if the sub content is in our array
		await CourseSubContent.deleteMany({_id: {$in: courseContent.courseSubContent}});

        // delete the course content
		await CourseContent.findByIdAndDelete(courseContentId);

		//find the updated course and return 
		const course = await Course.findById(courseId)
		// .populate({
		// 	path:"courseContent",
		// 	populate: {
		// 		path: "courseSubContent"
		// 	}
		// })
		.exec();

		res.status(200).json({
			success:true,
			message:"Course content deleted",
			data:course
		});
	} catch (err) {
		console.error("Error deleting course content:", err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   