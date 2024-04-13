const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
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
        image: {
            type: String,
            // required: true,
        },
        // Add timestamps for when the document is created and last modified
    },
    { timestamps: true }
);
// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);