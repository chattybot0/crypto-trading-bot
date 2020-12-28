# Crypto Trading Bot
Simple bitcoin trading bot made with nodejs

Installation:
Run this in your shell:
`curl -O "https://raw.githubusercontent.com/chattybot0/crypto-trading-bot/master/traderbot.js"; npm install axios; npm install ccxt; npm install ms`

This is an example on how to use:

```JS
/* Here we initialize the bot constructor */
const TradeBot = require("./traderbot.js");

/* This is the bot configuration, read carefully how to use. */
const configuration = {
	/* The asset defines what currency the bot should buy*/
	asset: 'BTC',
	/* Since the bot uses the binance API, you cannot trade to Dollar or a fiat, so we trade to USDT or Tether, which is roughly 1 dollar.*/
	base: 'USDT',
	/* Allocation says how much of the remained money should be used for a tick, 0.1 is the best option. */
	allocation: 0.1,
	/* Spread defines how much the error percentage should be */
	spread: 0.2,
	/* For binance, the tick interval should be more than 2 seconds or 2000 miliseconds, so 2500 is the best option. */
	tickInterval: 2500
};

/* Here we give the bot the API key, the API secret, and the configuration. You could register for the API at binance.com */
TradeBot.start(process.env.API_KEY, process.env.API_SECRET, configuration);
```

The module has only the start function, so it's not too complicated.