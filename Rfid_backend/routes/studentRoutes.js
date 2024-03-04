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
  .post(studentController.createNewStudent);

router.route("/getattendance").post(studentController.getAttendance);
router.route("/getAllLecs").post(studentController.getAllLecs);
 

module.exports = router;
