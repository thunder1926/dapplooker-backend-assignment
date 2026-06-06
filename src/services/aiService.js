const axios = require("axios");

const buildPrompt = ({ tokenData, marketChart, vsCurrency, historyDays }) => {
  const marketData = tokenData.market_data || {};

  const simplifiedChart =
    marketChart && marketChart.prices
      ? marketChart.prices.slice(-5).map((item) => ({
          timestamp: item[0],
          price: item[1]
        }))
      : [];

  return `
You are a crypto market analyst.

Analyze the following token data and return ONLY valid JSON.

Token Info:
- Name: ${tokenData.name}
- Symbol: ${tokenData.symbol}
- Current Price (${vsCurrency}): ${marketData.current_price?.[vsCurrency] ?? "N/A"}
- Market Cap (${vsCurrency}): ${marketData.market_cap?.[vsCurrency] ?? "N/A"}
- Total Volume (${vsCurrency}): ${marketData.total_volume?.[vsCurrency] ?? "N/A"}
- 24h Change: ${marketData.price_change_percentage_24h ?? "N/A"}

Historical Summary:
- Days: ${historyDays}
- Recent Price Points: ${JSON.stringify(simplifiedChart)}

Return JSON in this exact structure:
{
  "reasoning": "short analysis here",
  "sentiment": "Bullish or Neutral or Bearish"
}
`.trim();
};

const parseJsonResponse = (rawText) => {
  try {
    return JSON.parse(rawText);
  } catch (e) {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI response was not valid JSON");
    }
    return JSON.parse(match[0]);
  }
};

const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY);

const callHuggingFace = async (prompt) => {
  try {
    const result = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200
    });

    const rawText = result.choices[0].message.content;
    return parseJsonResponse(rawText);

  } catch (err) {
    console.error("HF ERROR:", err);
    throw err;
  }
};


const callOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing in .env");
  }

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: {
        type: "json_object"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    }
  );

  const rawText = response.data.choices[0].message.content;
  return parseJsonResponse(rawText);
};

const generateTokenInsight = async (payload) => {
  const prompt = buildPrompt(payload);

  let result;

  if (process.env.AI_PROVIDER === "openai") {
    result = await callOpenAI(prompt);
  } else {
    result = await callHuggingFace(prompt);
  }

  if (!result.reasoning || !result.sentiment) {
    throw new Error("AI response missing required fields");
  }

  return {
    reasoning: result.reasoning,
    sentiment: result.sentiment
  };
};

module.exports = {
  generateTokenInsight
};