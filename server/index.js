const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const createError = require('http-errors');
const logger = require('morgan');
const path = require("path");

const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user");
const helmet = require("helmet");

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const categoryRoutes = require("./routes/category");
const courseContentRoutes = require("./routes/courseContent");
const courseSubContentRoutes = require("./routes/courseSubContent");
const ratingAndReviewRoutes = require("./routes/ratingAndReview");

const dev_db_url =
    "mongodb+srv://kothapallisantoshece22:6zPFY03uyofZn3oV@cluster0.iyzydsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

const sessionConfig = {
    name: "kaguya",
    secret: "kaguyaShinomiya",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false, //setting this false for http connection
    },
};
app.use(session(sessionConfig));

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use(helmet({ contentSecurityPolicy: false }));

// app.use(csrf());
// app.use(function (req, res, next) {
//     var msgs = req.session.messages || [];
//     res.locals.messages = msgs;
//     res.locals.hasMessages = !!msgs.length;
//     req.session.messages = [];
//     next();
// });
// app.use(function (req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/course", courseRoutes);
app.use("/courseContent", courseContentRoutes);
app.use("/courseSubContent", courseSubContentRoutes);
app.use("/ratingAndReview", ratingAndReviewRoutes);


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });


app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     res.status(err.status || 500);
//     res.send('error');
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("ON PORT", PORT, "!");
    console.log("Hola I am Santosh");
});