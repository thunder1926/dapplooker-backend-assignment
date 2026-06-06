const {
  fetchTokenMetadata,
  fetchTokenMarketChart
} = require("../services/coinGeckoService");

const {
  generateTokenInsight
} = require("../services/aiService");

const getTokenInsight = async (req, res, next) => {
  try {
    const tokenId = req.params.id;
    const vsCurrency = req.body.vs_currency || "usd";
    const historyDays = req.body.history_days || 30;

    const tokenData = await fetchTokenMetadata(tokenId);

    const marketChart = await fetchTokenMarketChart(
      tokenId,
      vsCurrency,
      historyDays
    );

    const insight = await generateTokenInsight({
      tokenData,
      marketChart,
      vsCurrency,
      historyDays
    });

    return res.json({
      source: "coingecko",
      token: {
        id: tokenData.id,
        symbol: tokenData.symbol,
        name: tokenData.name,
        market_data: {
          current_price_usd: tokenData.market_data?.current_price?.usd || null,
          market_cap_usd: tokenData.market_data?.market_cap?.usd || null,
          total_volume_usd: tokenData.market_data?.total_volume?.usd || null,
          price_change_percentage_24h:
            tokenData.market_data?.price_change_percentage_24h || null
        }
      },
      insight,
      model: {
        provider:
          process.env.AI_PROVIDER === "openai" ? "openai" : "huggingface",
        model:
          process.env.AI_PROVIDER === "openai"
            ? "gpt-4o-mini"
            : "mistralai/Mistral-7B-Instruct-v0.2"
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTokenInsight
};