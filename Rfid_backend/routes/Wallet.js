const express = require("express");
const { Wallet } = require("../controllers/walletController");
const router = express.Router();
const Wallets = require("./../models/wallets");

router
  .route("/")
  .post(Wallet);




module.exports = router;
