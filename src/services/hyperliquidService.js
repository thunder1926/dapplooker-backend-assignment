const axios = require("axios");

const HYPERLIQUID_API = "https://api.hyperliquid.xyz/info";

async function fetchUserFills(wallet, start) {
  try {
    const startTime = new Date(start).getTime();

    const payload = {
      type: "userFillsByTime",
      user: wallet,
      startTime
    };

    console.log("Sending userFillsByTime payload:", payload);

    const response = await axios.post(
      HYPERLIQUID_API,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (err) {
    console.error("USER FILLS ERROR:");
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
    throw err;
  }
}

const calculateWalletPnL = async (wallet, start, end) => {

  const fills = await fetchUserFills(wallet, start);

  const startDate = new Date(start);
  const endDate = new Date(end);

  // include full end day
  endDate.setHours(23, 59, 59, 999);

  const dailyMap = {};

  fills.forEach(fill => {

    const fillDate = new Date(fill.time);

    if (fillDate < startDate || fillDate > endDate) {
      return;
    }

    const date = fillDate
      .toISOString()
      .split("T")[0];

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        realized_pnl_usd: 0,
        unrealized_pnl_usd: 0,
        fees_usd: 0,
        funding_usd: 0,
        net_pnl_usd: 0,
        equity_usd: 0
      };
    }

    dailyMap[date].realized_pnl_usd +=
      Number(fill.closedPnl || 0);

    dailyMap[date].fees_usd +=
      Number(fill.fee || 0);
  });

  const daily = Object.values(dailyMap)
    .sort((a, b) => a.date.localeCompare(b.date));

  daily.forEach(day => {
    day.net_pnl_usd =
      day.realized_pnl_usd -
      day.fees_usd +
      day.funding_usd;

    day.equity_usd = day.net_pnl_usd;
  });

  const summary = {
    total_realized_usd: daily.reduce(
      (sum, day) => sum + day.realized_pnl_usd,
      0
    ),

    total_unrealized_usd: daily.reduce(
      (sum, day) => sum + day.unrealized_pnl_usd,
      0
    ),

    total_fees_usd: daily.reduce(
      (sum, day) => sum + day.fees_usd,
      0
    ),

    total_funding_usd: daily.reduce(
      (sum, day) => sum + day.funding_usd,
      0
    )
  };

  summary.net_pnl_usd =
    summary.total_realized_usd -
    summary.total_fees_usd +
    summary.total_funding_usd;

  return {
    wallet,
    start,
    end,

    daily,

    summary,

    diagnostics: {
      data_source: "hyperliquid_api",
      last_api_call: new Date().toISOString(),
      fills_processed: fills.length,
      notes:
        "Daily realized PnL and fees calculated from HyperLiquid fills"
    }
  };
};

module.exports = {
  calculateWalletPnL
};