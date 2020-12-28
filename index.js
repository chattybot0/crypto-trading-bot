const ccxt = require('ccxt');
const axios = require('axios');
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));


tick = async (config, binanceClient) => {
	console.clear();
	const allocation = config.allocation;
	const asset = config.asset;
	const base = config.base;
	const spread = config.spread;
	const tickInterval = config.tickInterval;
	const market = `${asset}/${base}`;

	const orders = await binanceClient.fetchOpenOrders(market);
	orders.forEach(async order => {
		await binanceClient.cancelOrder(order.id);
	});

	const results = await Promise.all([
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
	]);
	const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd;

	const sellPrice = marketPrice * (1 + spread);
	const buyPrice = marketPrice * (1 - spread);
	const balances = await binanceClient.fetchBalance();
	const assetBalance = balances.free[asset];
	const baseBalance = balances.free[base];
	const sellVolume = assetBalance * allocation;
	const buyVolume = (baseBalance * allocation) / marketPrice;

	console.log(`sellPrice: ${sellPrice}
buyPrice: ${buyPrice}
assetBalance: ${assetBalance}
baseBalance: ${baseBalance}
sellVolume: ${sellVolume}
buyVolume: ${buyVolume}
	
	
	`);

	try {
		await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice);
		await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice);
		console.log(`
New tick for ${market}...
Create limit sell order for ${sellVolume}@${sellPrice}
Create limit buy order for ${buyVolume}@${buyPrice}
Success!
Sleeping the thread for the specified time...
`);
		await snooze(tickInterval);
	}
	catch (err) {
		console.log("Hmmm... We couldn't send a successfull request. The thread will sleep 5 seconds to recover the error...\n" + err);
		await snooze(5000);
	}
	console.log("Reloading the tick...");
	await snooze(500);
	tick(config, binanceClient);
};

const run = () => {
	const config = {
		asset: 'BTC',
		base: 'USDT',
		allocation: 0.1,
		spread: 0.2,
		tickInterval: 2500
	};
	const binanceClient = new ccxt.binance({
		apiKey: process.env.API_KEY,
		secret: process.env.API_SECRET
	});

	tick(config, binanceClient);
};

const start = (apiKey,apiSecret) => {
	console.log("Initializing the bot...");
	run();
}

module.exports = {start};