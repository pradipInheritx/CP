export const wazirXAPIEndPoint = "https://api.wazirx.com/sapi/v1/tickers/24hr";
export const coinCapAPIEndPoint = "https://api.coincap.io/v2/rates";
export const defaultHeader = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
};
export const successMessage =
  "All coins fetched successfully from wazirX & coinCap.";
export const errorMessage =
  "Error while fetched the coins from WazirX & Coin Cap.";

//export const webSocketBaseURL = "wss://stream.wazirx.com/stream";

export const webSocketBaseURL = "wss://stream.binance.us:9443/ws";

export const allTradeCoinsRateForWzirX = [
  "btcusdt@trades",
  "ethusdt@trades",
  "bnbusdt@trades",
  "adausdt@trades",
  "solusdt@trades",
  "xrpusdt@trades",
  "dogeusdt@trades",
  "dotusdt@trades",
  "shibusdt@trades",
  "maticusdt@trades",
  "ltcusdt@trades",
  "linkusdt@trades",
  "uniusdt@trades",
  "trxusdt@trades",
  "xlmusdt@trades",
  "manausdt@trades",
  "hbarusdt@trades",
  "vetusdt@trades",
  "sandusdt@trades",
];

export const allTradeCoinsRate = [
  "xrpusdt@ticker",
  "maticusdt@ticker",
  "vetusdt@ticker",
  "bnbusdt@ticker",
  "cakeusdt@ticker",
  "manausdt@ticker",
  "eosusdt@ticker",
  "xlmusdt@ticker",
  "dogeusdt@ticker",
  "btcusdt@ticker",
  "uniusdt@ticker",
  "ethusdt@ticker",
  "sandusdt@ticker",
  "dotusdt@ticker",
  "linkusdt@ticker",
  "shibusdt@ticker",
  "trxusdt@ticker",
  "ltcusdt@ticker",
  "crousdt@ticker",
  "solusdt@ticker",
  "adausdt@ticker",
  "hbarusdt@ticker"
]

export const getDataFromTimestampBaseURL = (symbol: string, timestamp: any) => {
  console.info("symbol", symbol)
  //return `https://api.binance.us/api/v3/aggTrades?symbol=${symbol}&startTime=${timestamp}&limit=1`;
  return `https://api.binance.us/api/v3/aggTrades?symbol=${symbol}&limit=1`;
  //`https://api.wazirx.com/api/v2/trades?market=${symbol}&signature=''&timestamp=${timestamp}&limit=5`;
}

export const getDataFromTimestampBaseURLFromCrypto = (symbol: string, timestamp: any) => {
  console.info("symbol", symbol)
  //return `https://api.binance.us/api/v3/aggTrades?symbol=${symbol}&startTime=${timestamp}&limit=1`;
  return `https://api.crypto.com/v2/public/get-ticker?instrument_name=${symbol}`;
  //`https://api.wazirx.com/api/v2/trades?market=${symbol}&signature=''&timestamp=${timestamp}&limit=5`;
}

export const getDataFromTimestampBaseURLFromKuCoin = (symbol: string, timestamp: any) => {
  console.info("symbol", symbol)
  //return `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=CAKE-USDT`;
  return `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=CAKE-USDT`;
  //`https://api.wazirx.com/api/v2/trades?market=${symbol}&signature=''&timestamp=${timestamp}&limit=5`;
}

export const defaultHeaderForgetDataFromTimestamp = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
};

export const upgradeMessage:  { [key: string]: any } =  {
  Speaker: `🎉 Congratulations! You've Been Upgraded to Speaker!`,
  Council: `🎉Promotion Alert: You're Now a Minister!`,
  Ambassador: `📰 Breaking News: You're Now an Ambassador!`,
  Minister: `📈 Promotion Earned: You're Now Upgraded to Consul!`,
  Chairman: `You've Been Upgraded to Chairman!`
}


export const downGradeMessage:  { [key: string]: any } =   {
  Speaker: `🚨 Title Change: You're Now a Speaker`,
  Council: `🛑 Title Update: You've Transitioned to Consul`,
  Ambassador: `🛑 Title Change: You're Now an Ambassador`,
  Minister: `🚨Title Update: You've Transitioned to Minister`,
  Chairman: `Title Change: You're Now a Chairman`
}
