const express = require("express");
const router = express.Router();
const AdminController = require("./../controllers/AdminController");


router
  .route("/:id")
  .get(AdminController.getAdmin);

module.exports = router;
