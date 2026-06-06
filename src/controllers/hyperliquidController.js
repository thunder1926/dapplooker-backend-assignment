const {
  calculateWalletPnL
} = require("../services/hyperliquidService");

const getWalletPnL = async (req, res, next) => {
  try {
    const wallet = req.params.wallet;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        error: "start and end query parameters are required"
      });
    }

    const result = await calculateWalletPnL(
      wallet,
      start,
      end
    );

    return res.json(result);

  } catch (error) {
  console.error(error.response?.data || error.message);

  return res.status(500).json({
    error: error.response?.data || error.message
  });
}
};

module.exports = {
  getWalletPnL
};