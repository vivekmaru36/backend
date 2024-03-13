const express = require("express");
const router = express.Router();
const timeScheduleController = require("./../controllers/timeScheduleController");

router.route("/View_Time_Schedule").get(timeScheduleController.getTimeScheduleE);

router
  .route("/:teacher_id")
  .get(timeScheduleController.getTimeSchedule)
  // .post(timeScheduleController.addTimeSchedule)
  .patch(timeScheduleController.updateTimeSchedule)
  .delete(timeScheduleController.deleteTimeSchedule);


router.route("/add").post(timeScheduleController.addTimeSchedule);

module.exports = router;