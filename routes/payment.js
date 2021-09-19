const express = require("express");
const router = express.Router();

const {isSignedIn, isAuthenticated} = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/payment");

router.get("/user/:userId/payment/gettoken", isSignedIn, getToken);

router.post("/user/:userId/payment/braintree", isSignedIn, processPayment);

module.exports = router;