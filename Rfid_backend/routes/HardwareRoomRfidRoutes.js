const express = require("express");
const router = express.Router();
const HardwareRoomController = require("../controllers/HarwareRoomController")


router.route('/').post(HardwareRoomController.HardwareRFid);
router.route('/EntryGate').post(HardwareRoomController.EntryGate);
router.route('/Library').post(HardwareRoomController.Library);
router.route('/Auditorium').post(HardwareRoomController.Auditorium);

module.exports = router;