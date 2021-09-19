const express = require("express");
const router = express.Router();

const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus, getOrder} = require("../controllers/order");
const {updateStock} = require("../controllers/product");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Create
router.post("/user/:userId/order/create", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

//Read
router.get("/user/:userId/orders/all", isSignedIn, isAuthenticated, isAdmin, getAllOrders);
router.get("/user/:userId/order/status", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.get("/user/:userId/order/:orderId/details", isSignedIn, isAuthenticated, getOrder);

//Update
router.put("/user/:userId/order/:orderId/status/update", isSignedIn, isAuthenticated, isAdmin, updateOrderStatus);

module.exports = router;