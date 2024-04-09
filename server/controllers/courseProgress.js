const mongoose = require("mongoose");
const Course = require("../models/course");
const CourseContent = require("../models/courseContent");
const CourseSubContent = require("../models/courseSubContent");
const CourseProgress = require("../models/courseProgress");

exports.updateCourseProgress = async (req, res) => {
    const { courseId, courseSubContentId } = req.body;
    const userId = req.user.id;

    try {
        // TODO
        // Check if course and courseSubContent is valid

        // Check if the course progress document exists
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        if (!courseProgress) {
            // If course progress doesn't exist, create a new one
            courseProgress = new CourseProgress({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })
        }
        else {
            // If course progress exists, check if the courseSubContent is already completed 
            if (courseProgress.completedVideos.includes(courseSubContentId)) {
                // If the courseSubContent is already completed, return it with success
                return res.status(200).json({
                    success: true,
                    message: "Course video already completed",
                    courseProgress: courseProgress
                })
            }
            else {
                // If the subContentID video is not already completed, add it to the completedVideos array
                courseProgress.completedVideos.push(courseSubContentId);
            }
        }

        // Save the updated course progress
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Course progress Updated",
            courseProgress: courseProgress,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }