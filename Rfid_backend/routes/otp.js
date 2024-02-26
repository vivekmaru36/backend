const express = require("express");
const { otp } = require("../controllers/otp");
const router = express.Router();


router.route('/').post(otp);


module.exports = router;