import { BarData, BusinessDay, Time } from "lightweight-charts";
import { Coin, CoinSnap } from "./Coin";
import moment, { Moment } from "moment";
import { IHistoricTrade } from "@polygon.io/client-js";
import { rest } from "./Socket";
import { flatten } from "lodash";
import { IAggsQuery } from "@polygon.io/client-js/lib/rest/stocks/aggregates";
import { ITradeCryptoEvent } from "@polygon.io/client-js/lib/websockets/crypto";

export enum ChartTimeFrames {
  HOUR = "Hour",
  DAY = "Day",
  MONTH = "Month",
  YEAR = "Year",
}

export const ChartTimeFramesInDays = {
  [ChartTimeFrames.HOUR]: 1 / 24,
  [ChartTimeFrames.DAY]: 1,
  [ChartTimeFrames.MONTH]: 30,
  [ChartTimeFrames.YEAR]: 365,
};

export const getMilliSeconds = (time: ChartTimeFrames) => {
  const hour = 60 * 60 * 1000;
  switch (time) {
    case ChartTimeFrames.HOUR:
      return hour;
    case ChartTimeFrames.DAY:
      return 24 * hour;
    case ChartTimeFrames.MONTH:
      return 30 * 24 * hour;
    case ChartTimeFrames.YEAR:
      return 365 * 24 * hour;
  }

  return 0;
};

export const getBarDataArray = (data: CoinSnap[], coin: Coin) => {
  const values = data.reduce((t, doc) => {
    const p = doc.data[coin.symbol].price;
    const iso = new Date(doc.timestamp).toISOString().split("T")[0];

    if (t[iso]) {
      t[iso].push(p);
    } else {
      t[iso] = [p];
    }
    return t;
  }, {} as { [key: string]: number[] });

  return data.reduce((total, doc, index, arr) => {
    const iso = new Date(doc.timestamp).toISOString().split("T")[0];
    const current = total.find((t) => t.time === iso) || ({} as BarData);
    const i = total.findIndex((t) => t.time === iso);

    current.time = iso;
    current.high = Math.max(...values[iso]);
    current.low = Math.min(...values[iso]);
    current.open = values[iso][0];
    current.close = values[iso][values[iso].length - 1];

    if (i < 0) {
      total.push(current);
    } else {
      total.splice(i, 1, current);
    }
    return total;
  }, [] as BarData[]);
};

export const convertToLineData = (doc: CoinSnap, coin: Coin) => {
  return {
    time: getBusinessDay(moment(new Date(Number(doc.timestamp)))),
    value: doc.data[coin.symbol]?.price,
  } as unknown as BarData;
};

export const formatDate = (date: Moment = moment()) =>
  date.format("yyyy-MM-DD");

export const getBusinessDay = (date: Moment = moment()) => {
  const [year, month, day] = formatDate(date)
    .split("-")
    .map((d) => Number(d));

  return {
    day,
    month,
    year,
  } as BusinessDay;
};

export const getHistoricData = async (from: string, to: string, date: Date) => {
  const today = formatDate(moment(date));
  return await rest.historicTrades(from, to, today);
};

export const lastXDays = (x: number) =>
  [...new Array(Math.ceil(x))]
    .map((_, idx) => {
      return moment().startOf("day").subtract(idx, "days");
    })
    .map((d) => {
      return formatDate(d);
    });

export const calcBarData = async (
  symbol: string,
  limit: number,
  timespan: string = "minute",
  from: string = formatDate(moment().subtract(1, "days")),
  to: string = formatDate(moment()),
  multiplier: number = 1,
  stringDate: boolean = false,
  checkYesterday: boolean = false
) => {
  const ticker = `X:${symbol}USD`;
  let data = await rest.aggregates(ticker, multiplier, timespan, from, to, {
    limit,
    adjusted: "true",
  } as IAggsQuery);

  if (checkYesterday) {
    const data1 = await rest.aggregates(
      ticker,
      multiplier,
      timespan,
      formatDate(moment().subtract(1, "days")),
      formatDate(moment()),
      {
        limit,
        adjusted: "true",
      } as IAggsQuery
    );
    const data2 = await rest.aggregates(
      ticker,
      multiplier,
      timespan,
      formatDate(moment().subtract(1, "days")),
      formatDate(moment().subtract(1, "days")),
      {
        limit,
        adjusted: "true",
      } as IAggsQuery
    );

    data.results = [...(data1.results || []), ...(data2.results || [])];
  }
  return (
    data.results?.map((result) => {
      const { t, o, c, h, l } = result;
      return {
        time: stringDate ? formatDate(moment(t)) : Number(t) / 1000,
        open: o,
        close: c,
        high: h,
        low: l,
        value: c,
      } as BarData;
    }) || ([] as BarData[])
  );
};

export const getBarDataHistoric = async (
  symbol: string,
  chartTimeFrame: number = 1
) => {
  const historicData = await getBulkHistoricData(chartTimeFrame, symbol, "USD");
  const snaps = flatten(
    Object.values(historicData).map((d, i) => {
      const data = {} as { [symbol: string]: Coin };
      d.ticks?.reduce((total, current, i) => {
        total[symbol] = {
          price: current.p,
        } as Coin;
        return total;
      }, data);
      return d.ticks?.map((tick) => {
        return {
          timestamp: Number(tick.t).toString(),
          data,
        } as CoinSnap;
      });
    })
  );
  return snaps.reduce((total, current) => {
    if (current) {
      const barData = convertToLineData(current, { symbol } as Coin);
      total.push(barData);
    }
    return total;
  }, [] as BarData[]) as BarData[];
};
export const getBulkHistoricData = async (
  x: number,
  from: string,
  to: string
) => {
  const dateArray = lastXDays(x);
  const objs = dateArray.reduce((total, current, i) => {
    const p = getHistoricData(from, to, new Date(current));
    total.push({ date: current, promise: p });
    return total;
  }, [] as { date: string; promise: Promise<IHistoricTrade> }[]);

  try {
    const data = await Promise.all(objs.map((p) => p?.promise));
    return objs.reduce((total, current, index) => {
      total[current?.date] = data[index];
      return total;
    }, {} as { [key: string]: IHistoricTrade });
  } catch (e) {
    return objs.reduce((total, current, index) => {
      total[current?.date] = {};
      return total;
    }, {} as { [key: string]: IHistoricTrade });
  }
};

export const calcStats = (
  data: ITradeCryptoEvent[],
  chartTimeFrame: number = ChartTimeFramesInDays[ChartTimeFrames.HOUR],
  lastUpdate: Time = ""
) => {
  let date = false;
  switch (chartTimeFrame) {
    case ChartTimeFramesInDays[ChartTimeFrames.MONTH]:
    case ChartTimeFramesInDays[ChartTimeFrames.YEAR]:
      date = true;
  }
  const first = data[0];
  const last = data[data.length - 1];
  const time = date
    ? getBusinessDay(moment(new Date(last.t)))
    : Math.floor(last.t / 1000);
  const open = first.p;
  const close = last.p;
  const prices = data.map((d) => d.p);
  const high = Math.max(...prices);
  const low = Math.min(...prices);

  if (
    lastUpdate &&
    new Date(lastUpdate as number).getTime() * 1000 <
      new Date(time as number).getTime() * 1000
  ) {
    return {
      time,
      open,
      close,
      high,
      low,
    } as BarData;
  } else return null;
};

export const getConsts = (chartTimeFrame: number) => {
  let multiplier = 1;
  let from = formatDate(moment().subtract(1, "days"));
  let to = formatDate(moment());
  let stringDate = false;
  let timespan = "minute";
  let checkYesterday = false;
  let interval = 1000 * 30;

  switch (chartTimeFrame) {
    case ChartTimeFramesInDays[ChartTimeFrames.HOUR]:
      from = formatDate(moment());
      to = formatDate(moment());
      checkYesterday = true;
      break;
    case ChartTimeFramesInDays[ChartTimeFrames.MONTH]:
      from = formatDate(moment().subtract(30, "days"));
      multiplier = 6 * 60;
      interval = 6 * 60 * 60 * 1000;
      // stringDate = true;
      break;
    case ChartTimeFramesInDays[ChartTimeFrames.YEAR]:
      from = formatDate(moment().subtract(365, "days"));
      multiplier = 1;
      stringDate = true;
      timespan = "day";
      interval = 24 * 60 * 60 * 1000;
      break;
  }

  return {
    multiplier,
    from,
    to,
    stringDate,
    timespan,
    checkYesterday,
    interval,
  };
};
