require("dotenv").config();

const express = require("express");
const tokenRoutes = require("./routes/tokenRoutes");
const hyperliquidRoutes = require("./routes/hyperliquidRoutes");

const app = express();

app.use(express.json());
app.use("/api/token", tokenRoutes);
app.use("/api/hyperliquid", hyperliquidRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "DappLooker Token Insight API is running"
  });
});

app.use("/api/token", tokenRoutes);

app.use((err, req, res, next) => {
  console.error("Global error:", err.message);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});