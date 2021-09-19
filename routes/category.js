const express = require("express");
const router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, deleteCategory} = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Create
router.post("/user/:userId/category/create", isSignedIn, isAuthenticated, isAdmin, createCategory);

//Read
router.get("/category/:categoryId", getCategory);
router.get("/categories/all", getAllCategory);

//Update
router.put("/user/:userId/category/:categoryId/update", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//Delete
router.delete("/user/:userId/category/:categoryId/delete", isSignedIn, isAuthenticated, isAdmin, deleteCategory);

module.exports = router;