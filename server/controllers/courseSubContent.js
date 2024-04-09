// Import necessary modules
const CourseContent = require("../models/courseContent");
const Course = require("../models/course");
const CourseSubContent = require("../models/courseSubContent");
// const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require('cloudinary').v2;

// CREATE
exports.createCourseSubContent = async (req, res) => {
    try {
        const { courseContentId, title, description } = req.body
        const video = req.files.video

        // Check if all necessary fields are provided
        if (!courseContentId || !title || !description || !video) {
            return res
                .status(404)
                .json({ success: false, message: "All Fields are Required" })
        }
        console.log(video)

        // const uploadDetails = await uploadImageToCloudinary(
        //     video,
        //     process.env.FOLDER_NAME
        // )
        // console.log(uploadDetails);

        // Upload the video file to Cloudinary
        const uploadDetails = await cloudinary.uploader
            .upload(video, {
                folder: process.env.FOLDER_NAME,
                public_id: uploadDetails.public_id,
                resource_type: "video",
                tags: ["courseContent"],
                public_folder: process.env.CLOUDINARY_PUBLIC_FOLDER,
                use_filename: true,
                use_filename_prefix: true,
                use_filename_extension: true,
                use_filename_path: true,
                use_filename_path_extension: true,
                use_filename_path_prefix: true,
                use_filename_path_suffix: true,
            });
        console.log(uploadDetails);

        // Create a new sub-content with the necessary information
        const CourseSubContentDetails = await CourseSubContent.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        // Update the corresponding course content section with the newly created sub-content
        const updatedCourseContent = await CourseContent.findByIdAndUpdate(
            { _id: courseContentId },
            { $push: { courseSubContent: CourseSubContentDetails._id } },
            { new: true }
        ).populate("courseSubContent")

        // Return the updated course content in the response
        return res.status(200).json({ success: true, data: updatedCourseContent })
    } catch (err) {
        // Handle any errors that may occur during the process
        console.error("Error creating new sub-content of course content:", err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        })
    }
}

// UPDATE
exports.updateCourseSubContent = async (req, res) => {
    try {
        const { courseContentId, courseSubContentId, title, description } = req.body
        const courseSubContent = await CourseSubContent.findById(courseSubContentId)

        // Check if course content is not found
        if (!courseSubContent) {
            return res.status(404).json({
                success: false,
                message: "Course SubContent not found",
                // error: err.message,
            })
        }

        // Update the course sub-content with provided details
        if (title !== undefined) {
            courseSubContent.title = title
        }
        if (description !== undefined) {
            courseSubContent.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            // const uploadDetails = await uploadImageToCloudinary(
            //     video,
            //     process.env.FOLDER_NAME
            // );
            // Upload the video file to Cloudinary
            const uploadDetails = await cloudinary.uploader
                .upload(video, {
                    folder: process.env.FOLDER_NAME,
                    public_id: uploadDetails.public_id,
                    resource_type: "video",
                    tags: ["courseContent"],
                    public_folder: process.env.CLOUDINARY_PUBLIC_FOLDER,
                    use_filename: true,
                    use_filename_prefix: true,
                    use_filename_extension: true,
                    use_filename_path: true,
                    use_filename_path_extension: true,
                    use_filename_path_prefix: true,
                    use_filename_path_suffix: true,
                });
            console.log(uploadDetails);
            courseSubContent.videoUrl = uploadDetails.secure_url
            courseSubContent.timeDuration = `${uploadDetails.duration}`
        }
        await courseSubContent.save();

        // Find updated course content and return it
        const updatedCourseContent = await CourseContent.findById(courseContentId).populate(
            "courseSubContent"
        )
        console.log("updated Course content", updatedCourseContent)

        return res.status(200).json({
            success: true,
            message: "Course sub-content updated successfully",
            data: updatedCourseContent,
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the Course sub-content",
            error: err.message,
        })
    }
}

// DELETE
exports.deleteCourseSubContent = async (req, res) => {
    try {
        const { courseContentId, courseSubContentId } = req.body;

        const courseSubContent = await CourseSubContent.findByIdAndDelete({ _id: courseSubContentId });

        // Return error if course sub-content not found
        if (!courseSubContent) {
            return res
                .status(404)
                .json({ success: false, message: "Course sub-content not found" })
        }

        await CourseContent.findByIdAndUpdate(
            { _id: courseContentId },
            {
                $pull: {
                    courseSubContent: courseSubContentId,
                },
            }
        )

        // Find updated section and return it
        const updatedCourseContent = await CourseContent.findById(courseContentId).populate(
            "courseSubContent"
        )

        return res.status(200).json({
            success: true,
            message: "Course sub-content deleted successfully",
            data: updatedCourseContent,
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the Course sub-content",
            error: err.message,
        })
    }
}