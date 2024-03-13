const express = require("express");
const router = express.Router();

const RecenRecordsController = require("../controllers/RecenRecordsController")

router.route('/').post(RecenRecordsController.RecentRecordsoOnRfid);
router.route('/AdminRecent').post(RecenRecordsController.RecentRecordsoOnRfidAdmin);

module.exports = router;