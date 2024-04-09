const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            // required: true,
            trim: true,
        },
        lastName: {
            type: String,
            // required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },
        // password: {
        //     type: String,
        //     required: true,
        // },

        // Used to store the user's role and in authentication
        accountType: {
            type: String,
            enum: ["Admin", "Student", "Instructor"],
            // required: true,
        },
        // active: {
        // 	type: Boolean,
        // 	default: true,
        // },
        // approved: {
        // 	type: Boolean,
        // 	default: true,
        // },
        // additionalDetails: {
        // 	type: mongoose.Schema.Types.ObjectId,
        // 	required: true,
        // 	ref: "Profile",
        // },

        // User's courses
        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "course",
            },
        ],
        // User's enrolled course progress
        courseProgress: [
            {
                type: Schema.Types.ObjectId,
                ref: "courseProgress",
            },
        ],
        // token: {
        // 	type: String,
        // },
        // resetPasswordExpires: {
        // 	type: Date,
        // },
        image: {
            type: String,
            // required: true,
        },
        // Add timestamps for when the document is created and last modified
    },
    { timestamps: true }
);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);