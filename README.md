# DappLooker Backend Assignment

## Setup

npm install

## Environment Variables

Copy .env.example to .env

## Run

npm run dev

## Endpoints

### Token Insight

POST /api/token/:id/insight

Example:

POST /api/token/bitcoin/insight

### HyperLiquid Daily PnL

GET /api/hyperliquid/:wallet/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD

Example:

GET /api/hyperliquid/0x08b6ba90a7613ddc7e86e02f41d0e08c80ad41e0/pnl?start=2026-06-05&end=2026-06-05

## Notes

- CoinGecko used for token data
- Hugging Face used for AI insights
- HyperLiquid used for wallet analytics
- Realized PnL derived from closedPnl
- Fees derived from fill fee data

## Assumptions

- Realized PnL is derived from HyperLiquid `closedPnl`
- Fees are derived from HyperLiquid fill fees
- Unrealized PnL and funding are currently returned as 0 when unavailable
- Daily aggregation is based on fill timestamps