const User = require("../models/user");
require("dotenv").config();

// Signup or Register
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            username,
            // password,
            // confirmPassword,
            accountType,
            // contactNumber,
            // otp,
        } = req.body;

        // Check if All Details are there or not
        if (
            !firstName ||
            !lastName ||
            !email ||
            !username
            // !password
            // !confirmPassword
            // !otp
        ) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }
        // Check if password and confirm password match
        // if (password !== confirmPassword) {
        //     return res.status(400).json({
        //         success: false,
        //         message:
        //             "Password and Confirm Password do not match. Please try again.",
        //     });
        // }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // // Find the most recent OTP for the email
        // const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        // console.log(response);
        // if (response.length === 0) {
        //     // OTP not found for the email
        //     return res.status(400).json({
        //         success: false,
        //         message: "The OTP is not valid",
        //     });
        // } else if (otp !== response[0].otp) {
        //     // Invalid OTP
        //     return res.status(400).json({
        //         success: false,
        //         message: "The OTP is not valid",
        //     });
        // }


        // const allUsers = await User.findByUsername();
        // console.log("allUsers", allUsers);

        // const username = firstName+lastName;
        // console.log("username", username);
        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            // contactNumber,
            // password: hashedPassword,
            // accountType: accountType,
            image: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${email}`,
        }).exec();
        // const registeredUser = await User.register(user, password);

        return res.status(200).json({
            success: true,
            user,
            registeredUser,
            message: "User registered successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
            error: err.message,
        });
    }
};

// Login 
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            // Return 400 Bad Request status code with error message
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }

        // Find user with provided email
        const user = await User.findOne({ email }).populate("additionalDetails");

        // If user not found with provided email
        if (!user) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }
    } catch (error) {
        console.error(error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
            error: err.message,
        });
    }
};

// // Send OTP For Email Verification
// exports.sendotp = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Check if user is already present
//         // Find user with provided email
//         const checkUserPresent = await User.findOne({ email });
//         // to be used in case of signup

//         // If user found with provided email
//         if (checkUserPresent) {
//             // Return 401 Unauthorized status code with error message
//             return res.status(401).json({
//                 success: false,
//                 message: `User is Already Registered`,
//             });
//         }

//         var otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false,
//         });
//         const result = await OTP.findOne({ otp: otp });
//         console.log("Result is Generate OTP Func");
//         console.log("OTP", otp);
//         console.log("Result", result);
//         while (result) {
//             otp = otpGenerator.generate(6, {
//                 upperCaseAlphabets: false,
//             });
//         }
//         const otpPayload = { email, otp };
//         const otpBody = await OTP.create(otpPayload);
//         console.log("OTP Body", otpBody);
//         res.status(200).json({
//             success: true,
//             message: `OTP Sent Successfully`,
//             otp,
//         });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// Logout user
exports.logout = async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
        });
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (err) {
        // If there's an error logging out the user, log the error and return a 500 (Internal Server Error) error
        // console.error("Error occurred while logging out user:", err);
        return res.status(500).json({
            success: false,
            message: "Error occurred while logging out user",
            error: err.message,
        });
    }
};


exports.allUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({ success: true, message: "Users fetched successfully", users });
    } catch (err) {
        // If there's an error fetching the users, log the error and return a 500 (Internal Server Error) error
        // console.error("Error occurred while fetching users:", err);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching users",
            error: err.message,
        });
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    }
};