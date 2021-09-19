const express = require("express");
const router = express.Router();
const {signup, signin, signout, isSignedIn, googleAuth, facebookAuth} = require("../controllers/auth");
const { check, validationResult } = require('express-validator');

router.post("/signup", [
     check('name').isLength({ min: 5 }).withMessage('Name must be at least 5 chars long'),
     check('email').isEmail().withMessage('Enter valid email!'),
     check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
     ], signup);

router.post("/signin", [
     check('email').isEmail().withMessage('Enter valid email!'),
     check('password').isLength({ min: 1 }).withMessage('Password is required!')
     ], signin);

router.get("/signout", signout);

router.post("/auth/google", googleAuth);
router.post("/auth/facebook", facebookAuth);

module.exports = router;