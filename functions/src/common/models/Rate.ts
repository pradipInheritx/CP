import { ajax_, snapshotAllTickers } from "./Ajax";
import { ICryptoSnapshotTickers } from "@polygon.io/client-js";
import { firestore } from "firebase-admin";
import axios from "axios";

import {
  getDataFromTimestampBaseURL,
  defaultHeaderForgetDataFromTimestamp,
  getDataFromTimestampBaseURLFromCrypto
} from "../consts/config";

export const getRateRemote_: () => Promise<
  CoinbaseResponse<Rate[]>
> = async () => {
  return ajax_("cryptocurrency/listings/latest");
};

export const getRateRemote: () => Promise<ICryptoSnapshotTickers> =
  async () => {
    return snapshotAllTickers();
  };

export type Rate = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  } | null;
  cmc_rank: number;
  last_updated: string;
  quote: {
    [key: string]: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
};

export type CoinbaseResponse<T> = {
  data: T;
};

// export const getPrice: (
//   data: ICryptoSnapshotTickers,
//   symbol: string
// ) => number = (data: ICryptoSnapshotTickers, symbol: string) => {
//   return (
//     data.tickers?.find((t) => t.ticker === `X:${symbol}USD`)?.lastTrade?.p || 0
//   );
// };

export const getPrice: (symbol: string) => any = async (symbol: string) => {
  const coinRef = firestore().collection("stats").doc("coins");

  const coinProps = await coinRef.get();
  const coinData = coinProps.data();
  let price = 0;
  // const timeFrameToAPICallInSecond = 30;
  // const priceLength = timeframe / timeFrameToAPICallInSecond;
  // let last24HoursPrice;
  // console.log('symbol --->', symbol);
  // console.log('coinData --->', coinData);
  // console.log('timeframe --->', timeframe);
  // console.log('coinData?[symbol] --->', coinData[symbol]);
  // const priceDataArray =  coinData?[symbol].last24HoursPrice || 0
  if (coinData?.hasOwnProperty(symbol)) {
    price = coinData[symbol].price;
    // console.log('coinData?[symbol] --->', coinData[symbol].last24HoursPrice);
    // last24HoursPrice = coinData[symbol].last24HoursPrice
    // if (coinData[symbol].last24HoursPrice.length > priceLength) {
    //   last24HoursPrice.length = priceLength
    // }
  }

  return price;
};

export const getPriceOnParticularTime = async (coin: any, timestamp: any) => {
  console.info("In Function", coin, "Timestamp", timestamp);
  try {
    if (coin && coin.includes("cro")) {

      let getOnlyCoin = coin.substring(0, 3);

      const getCoinPrice: any = await axios.get(
        getDataFromTimestampBaseURLFromCrypto(`${getOnlyCoin.toUpperCase()}_USDT`, timestamp),
        defaultHeaderForgetDataFromTimestamp
      );

      console.info("getCoinPrice", getCoinPrice.data.result.data[0]);

      return getCoinPrice && getCoinPrice.data && getCoinPrice.data.result.data[0].a ?
        Number(getCoinPrice.data.result.data[0].a) :
        0;
    } else {
      const getCoinPrice: any = await axios.get(
        getDataFromTimestampBaseURL(coin.toUpperCase(), timestamp),
        defaultHeaderForgetDataFromTimestamp
      );
      console.info("getCoinPrice", getCoinPrice.data);
      return getCoinPrice && getCoinPrice.data && getCoinPrice.data[0].p ?
        Number(getCoinPrice.data[0].p) :
        0;
    }

  } catch (error: any) {
    console.info("Error In Axios", error);
    return 0;
  }
};
