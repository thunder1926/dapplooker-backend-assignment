const express = require("express");
const router = express.Router();

const {
  getWalletPnL
} = require("../controllers/hyperliquidController");

router.get("/:wallet/pnl", getWalletPnL);

module.exports = router;