const express = require("express");
const router = express.Router();
const studentController = require("./../controllers/studentController");

router
  .route("/:id")
  .get(studentController.getStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createNewStudent)
  // .post(studentController.otp);


router
  .route("/otp")
  .post(studentController.otp);

module.exports = router;
