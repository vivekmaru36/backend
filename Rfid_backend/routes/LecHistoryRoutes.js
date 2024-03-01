const express = require("express");
const router = express.Router();


const LecHistoryController = require("../controllers/LecHistoryController");

router.route('/').post(LecHistoryController.TotalLec);
router.route('/ids').post(LecHistoryController.ids);

module.exports = router;
