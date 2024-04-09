const Category = require("../models/category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// CREATE
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // Check if category already exists
        const categoryDatabase =  await Category.find({
            name: name,
        });
        if(categoryDatabase.length !== 0){
            // return category already exists
            return res.status(400).json({
                success: false,
                message: "Category already exists",
                categoryInDatabase: categoryDatabase,
            });
        }

        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(CategoryDetails);

        return res.status(200).json({
            success: true,
            newCategory: CategoryDetails,
            message: "New category Created successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: true,
            message: err.message,
        });
    }
};

// GET ALL CATEGORIES
exports.showAllCategories = async (req, res) => {
    try {
        // console.log("INSIDE SHOW ALL CATEGORIES");
        const allCategories = await Category.find({});
        res.status(200).json({
            success: true,
            data: allCategories,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// GET Category page details
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        console.log("Category Id: ", categoryId);

        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                // match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec();
        //console.log("SELECTED COURSE", selectedCategory)
        
        // Return error if category is not found
        if (!selectedCategory) {
            console.log("Category not found.")
            return res
                .status(404)
                .json({ success: false, message: "Category not found" })
        }

        // TODO: Uncomment this
        // // Handle the case when there are no courses
        // if (selectedCategory.courses.length === 0) {
        //     console.log("No courses found for the selected category.")
        //     return res.status(404).json({
        //         success: false,
        //         message: "No courses found for the selected category.",
        //     })
        // }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "courses",
                // match: { status: "Published" },
            })
            .exec()
        //console.log("Different COURSE", differentCategory)

        // TODO : Did not clearly understand how this is going to work
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                // match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec();

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        console.log("mostSellingCourses ", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        })
    }
}

// TODO: DELETE Category