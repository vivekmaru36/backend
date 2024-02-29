const express = require("express");
const router = express.Router();
const teacherController = require("./../controllers/teacherController");

router.route("/").post(teacherController.createNewTeacher);




router
  .route("/")
  .post(teacherController.createNewTeacher);

module.exports = router;
