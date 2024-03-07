const express = require("express");
const router = express.Router();


const LecHistoryController = require("../controllers/LecHistoryController");

router.route('/').post(LecHistoryController.TotalLec);
router.route('/ids').post(LecHistoryController.ids);
router.route('/StudentInYourCourse').post(LecHistoryController.StudentInYourCourse);

module.exports = router;
