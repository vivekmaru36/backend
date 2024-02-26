const express = require("express");
const router = express.Router();

const HardwareController=require('../controllers/HardwareController')


router.route('/').post(HardwareController.setLec)
router.route('/').get(HardwareController.getLec)


module.exports = router;
