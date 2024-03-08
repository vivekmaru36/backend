const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

router.route("/login/teacher").post(authController.teacherLogin);
router.route("/login/student").post(authController.studentLogin);
router.route('/forgot-password').post(authController.forgotPassword);

router.route('/reset-password/:token').post(authController.resetPassword);

//? Incase of JWT
//   .route("/logout")
//   .post(authController.logout);

module.exports = router;
