export const wazirXAPIEndPoint = "http://api.wazirx.com/sapi/v1/tickers/24hr";
export const coinCapAPIEndPoint = "http://api.coincap.io/v2/rates";
export const defaultHeader = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
export const successMessage =
  "All coins fetched successfully from wazirX & coinCap.";
export const errorMessage =
  "Error while fetched the coins from WazirX & Coin Cap.";
