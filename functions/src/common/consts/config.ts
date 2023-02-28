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

export const webSocketBaseURL = "wss://stream.wazirx.com/stream";

export const allTradeCoinsRate = [
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
