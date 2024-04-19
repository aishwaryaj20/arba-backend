const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require('../middleware/verifyToken');

router.post("/register", userController.register);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.post('/forgot-password',verifyToken, userController.forgotPassword);
router.put('/update-profile',verifyToken, userController.updateProfile);

module.exports = router;