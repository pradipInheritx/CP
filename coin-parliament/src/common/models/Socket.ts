import { restClient, websocketClient } from "@polygon.io/client-js";
import { Coin } from "./Coin";
import coinList from "../consts/coins.json";
// @ts-ignore
import PolygonAdapter from "@polygon.io/tradingview-adapter";

export const rest = restClient(process.env.REACT_APP_POLYGON_API_KEY).crypto;

export const ws = websocketClient(
  process.env.REACT_APP_POLYGON_API_KEY + ""
).crypto();

export const coinsData = {} as { [symbol: string]: Coin };

export const fetchCoins = async (allCoins?:any) => {
  const res = await rest.snapshotAllTickers();
  
  const newCoins = res.tickers
    ?.map((t) => {
      if (t.ticker?.slice(-3) === "USD") {
        return {
          symbol: t.ticker?.substr(2).slice(0, -3) || "",
          price: t.lastTrade?.p || 0,
          // @ts-ignore
          trend:t?.todaysChangePerc || 0,
 };
      }
      return undefined;
    })
    .filter((t) => allCoins?.includes(t?.symbol))
    .reduce((total, current) => {
      if (current) {
        const { symbol, price, trend } = current;
        // @ts-ignore
        const data = coinList[symbol];
        const { id, name } = data || {};
        if (id) {
          total[symbol] = { price, symbol, id, name ,trend};
        }
        // @ts-ignore
       
      }
      
      return total;
    }, {} as { [key: string]: Coin });
    
  return newCoins || {};
};

export const subscribe = (symbols: string[]) => {
  ws.send(
    `{"action":"subscribe","params":"${symbols
      .map((symbol) => `XT.X:${symbol}-USD`)
      .join(",")}"}-USD`
  );
  
};

export const unsubscribe = (symbols: string[]) => {
  ws.send(
    `{"action":"unsubscribe","params":"${symbols
      .map((symbol) => `XT.X:${symbol}-USD`)
      .join(",")}"}-USD`
  );
};

export const polygonAdapterClient = new PolygonAdapter({
  apikey: process.env.REACT_APP_POLYGON_API_KEY + "",
  realtimeEnabled: true, // True(default) = Use websockets for updates. False = use polling for new data.
});
