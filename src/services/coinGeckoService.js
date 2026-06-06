const axios = require("axios");

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const fetchTokenMetadata = async (tokenId) => {
  try {
    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/${tokenId}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error("Token not found on CoinGecko");
      err.status = 404;
      throw err;
    }
    throw new Error("Failed to fetch token metadata from CoinGecko");
  }
};

const fetchTokenMarketChart = async (tokenId, vsCurrency = "usd", days = 30) => {
  try {
    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/${tokenId}/market_chart`,
      {
        params: {
          vs_currency: vsCurrency,
          days
        }
      }
    );

    return response.data;
  } catch (error) {
    return null;
  }
};

module.exports = {
  fetchTokenMetadata,
  fetchTokenMarketChart
};