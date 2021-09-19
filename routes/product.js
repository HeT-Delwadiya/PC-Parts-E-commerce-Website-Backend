const express = require("express");
const router = express.Router();

const {getProductById, createProduct, getProduct, getProductImage, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategory} = require("../controllers/product");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

router.param("userId", getUserById);
router.param("productId", getProductById);

//Create
router.post("/user/:userId/product/create", isSignedIn, isAuthenticated, isAdmin, createProduct);

//Read
router.get("/product/:productId", getProduct);
router.get("/product/:productId/image", getProductImage);

router.get("/products/all", getAllProducts);
router.get("/products/categories", getAllUniqueCategory)

//Update
router.put("/user/:userId/product/:productId/update", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//Delete
router.delete("/user/:userId/product/:productId/delete", isSignedIn, isAuthenticated, isAdmin, deleteProduct);

module.exports = router;