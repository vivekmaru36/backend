const express = require("express");
const router = express.Router();

const RecenRecordsController = require("../controllers/RecenRecordsController")

router.route('/').post(RecenRecordsController.RecentRecordsoOnRfid);

module.exports = router;