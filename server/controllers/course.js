const CourseContent = require("../models/courseContent");
const Course = require("../models/course");
const CourseSubContent = require("../models/courseSubContent");
const Category = require("../models/category");
const User = require("../models/user");
const CourseProgress = require("../models/courseProgress");
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

const { convertSecondsToDuration } = require("../utils");

// function convertSecondsToDuration(totalSeconds) {
//     const hours = Math.floor(totalSeconds / 3600)
//     const minutes = Math.floor((totalSeconds % 3600) / 60)
//     const seconds = Math.floor((totalSeconds % 3600) % 60)

//     if (hours > 0) {
//         return `${hours}h ${minutes}m`
//     } else if (minutes > 0) {
//         ;
//         return `${minutes}m ${seconds}s`;
//     } else {
//         return `${seconds}s`;
//     }
// };

// CREATE
exports.createCourse = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all required fields from request body
        // let {
        //     courseName,
        //     courseDescription,
        //     whatYouWillLearn,
        //     price,
        //     tag: _tag,
        //     category,
        //     // status,
        //     instructions: _instructions,
        // } = req.body
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            instructions,
        } = req.body

        // Get thumbnail image from request files
        const thumbnail = req.files.thumbnailImage;

        // // Convert the tag and instructions from stringified Array to Array
        // const tag = JSON.parse(_tag)
        // const instructions = JSON.parse(_instructions)
        // console.log("tag", tag);
        // console.log("instructions", instructions);

        // Check if any of the required fields are missing
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            // !tag.length ||
            // !thumbnail ||
            !category ||
            !instructions.length
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            })
        }
        // if (!status || status === undefined) {
        //     status = "Draft"
        // }

        // Check if the user is an instructor
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        })
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            })
        }

        // Check if the tag given is valid
        // const categoryDetails = await Category.findById(category).exec();
        const categoryDetails = await Category.find({
            name: tag,
        }).exec();
        console.log(categoryDetails);
        console.log(categoryDetails[0]._id);
        console.log(mongoose.Types.ObjectId.isValid(categoryDetails[0]._id));
        if (!categoryDetails || categoryDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            })
        }

        // // Upload the Thumbnail to Cloudinary
        // const thumbnailImage = await uploadImageToCloudinary(
        //     thumbnail,
        //     process.env.FOLDER_NAME
        // )
        // console.log(thumbnailImage);

        // Upload the Thumbnail to Cloudinary
        const thumbnailImage = await cloudinary.uploader
            .upload(thumbnail, {
                folder: process.env.FOLDER_NAME,
                public_id: uploadDetails.public_id,
                tags: ["thumbnailImage"],
                public_folder: process.env.CLOUDINARY_PUBLIC_FOLDER,
                resource_type: "image",
            });
        console.log(thumbnailImage);

        // Create a new course with the given details
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            // instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            // tag,
            category: categoryDetails[0]._id,
            // thumbnail: thumbnailImage.secure_url,
            // status: status,
            instructions,
        });

        // TODO: Uncomment
        // Add the new course to the User Schema of the Instructor
        // await User.findByIdAndUpdate(
        //     {
        //         _id: instructorDetails._id,
        //     },
        //     {
        //         $push: {
        //             courses: newCourse._id,
        //         },
        //     },
        //     { new: true }
        // );

        // Add the new course to the Categories
        const courseCategory = await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )
        console.log(courseCategory);

        // Return the new course and a success message
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        })
    } catch (err) {
        // Handle any errors that occur during the creation of the course
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: err.message,
        })
    }
}

// UPDATE
// exports.editCourse = async (req, res) => {
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const userId = req.user.id;
        
        const course = await Course.findById(courseId)
        // Return if course not found
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
        // Return error if course instructor and user are not same
        if(course.instructor !== userId){
            return res.status(403).json({ error: "You are not authorized to edit this course" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            console.log("thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            // const thumbnailImage = await uploadImageToCloudinary(
            //     thumbnail,
            //     process.env.FOLDER_NAME
            // );
            // course.thumbnail = thumbnailImage.secure_url;

            // Upload the Thumbnail to Cloudinary and set the url in the course
            const thumbnailImage = await cloudinary.uploader
                .upload(thumbnail, {
                    folder: process.env.FOLDER_NAME,
                    public_id: thumbnailImage.public_id,
                    tags: ["thumbnailImage"],
                    public_folder: process.env.CLOUDINARY_PUBLIC_FOLDER,
                    resource_type: "image",
                });
            course.thumbnail = thumbnailImage.secure_url;
            console.log(thumbnailImage);
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                // if (key === "tag" || key === "instructions") {
                //     course[key] = JSON.parse(updates[key])
                // } else {
                //     course[key] = updates[key]
                // }
                course[key] = updates[key];
            }
        }

        await course.save();

        // Return Updated course;
        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "courseSubContent",
                },
            })
            .exec()

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        })
    }
}

// READ ALL Course List
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            // { status: "Published" },
            // {
            //     courseName: true,
            //     // price: true,
            //     thumbnail: true,
            //     instructor: true,
            //     ratingAndReviews: true,
            //     studentsEnrolled: true,
            // }
        )
            .populate("instructor")
            .exec()

        return res.status(200).json({
            success: true,
            data: allCourses,
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: err.message,
        })
    }
};

// READ One Single Course Details
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "courseSubContent",
                    select: "-videoUrl",
                },
            })
            .exec()

        // Return error if course not found
        if (!courseDetails || courseDetails.length) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        };
        console.log(courseDetails);

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            if (content.courseSubContent.length !== 0) {
                content.courseSubContent.forEach((subSection) => {
                    //continue if CourseSubContent length is 0
                    // Get the total time duration of the subsection
                    const timeDurationInSeconds = parseInt(subSection.timeDuration)
                    totalDurationInSeconds += timeDurationInSeconds
                });
            }
        })
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// READ full course details of a particular course
exports.getUserCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        // If there are completed videos i.e. courseProgressCount set completed videos to it else empty vector
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// READ list of Courses for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 })

        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}

// DELETE the Course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled;
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // Delete course content and course sub-content
        const courseSections = course.courseContent;
        for (const contentID of courseSections) {
            // Delete sub-sections of the section
            const section = await CourseContent.findById(contentID)
            if (section) {
                const subSections = section.courseSubContent;
                for (const courseSubContentID of subSections) {
                    await CourseSubContent.findByIdAndDelete(courseSubContentID)
                }
            }
            // Delete the Course content
            await CourseContent.findByIdAndDelete(contentID);
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}