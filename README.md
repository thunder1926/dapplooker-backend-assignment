# DappLooker Backend Assignment

## Overview

This project implements the two backend APIs required for the DappLooker Full Stack Engineer Assignment:

1. Token Insight API
2. HyperLiquid Wallet Daily PnL API

## Tech Stack

* Node.js
* Express.js
* CoinGecko API
* Hugging Face Inference API

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure the required values:

```env
HF_API_KEY=your_huggingface_api_key_here
AI_PROVIDER=huggingface
PORT=3000
```

## Running the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Endpoints

### 1. Token Insight API

**POST** `/api/token/:id/insight`

Example:

```http
POST /api/token/bitcoin/insight
```

Returns:

* Token metadata
* Market data from CoinGecko
* AI-generated market insight

### 2. HyperLiquid Daily PnL API

**GET** `/api/hyperliquid/:wallet/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD`

Example:

```http
GET /api/hyperliquid/0x08b6ba90a7613ddc7e86e02f41d0e08c80ad41e0/pnl?start=2026-06-05&end=2026-06-05
```

Returns:

* Daily realized PnL
* Unrealized PnL
* Fees
* Net PnL
* Summary statistics

## Assumptions

* Realized PnL is derived from HyperLiquid `closedPnl`.
* Fees are derived from HyperLiquid fill fee data.
* Unrealized PnL and funding are returned as `0` when unavailable from the data source.
* Daily aggregation is based on fill timestamps.

## Postman Collection

Import:

```text
postman/DappLooker.postman_collection.json
```

Included requests:

* Token Insight API
* HyperLiquid Daily PnL API

## Notes

* CoinGecko is used as the market data provider.
* Hugging Face is used for AI-generated insights.
* HyperLiquid is used as the wallet activity source.
* API keys are managed through environment variables and are not committed to the repository.
