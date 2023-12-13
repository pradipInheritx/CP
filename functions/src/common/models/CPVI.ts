import { firestore } from "firebase-admin";
import { uniq } from "lodash";
import { voteConverter, VoteProps, VoteResultProps } from "./Vote";
import moment from "moment";
import { rest } from "./Ajax";
import { sequence_operate } from "./Coin";
import { LineData, UTCTimestamp } from "lightweight-charts";

export type CPVI = {
  coin: string;
  indication: number;
  interval: number;
  timestamp: string;
};

export type CPVIObj = {
  direction0: number;
  direction1: number;
  coin: string;
  timestamp: firestore.Timestamp;
};

export const getCPVI = async (coin: string) => {
  const remoteCPVI = await getRemote(coin, coin.indexOf("-") !== -1);
  const Obj: CPVIObj = {
    coin,
    ...remoteCPVI,
    timestamp: firestore.Timestamp.fromDate(new Date(Date.now())),
  };
  return Obj;
};

export const calculateTotal = (votes: VoteResultProps[]) => {
  return votes.reduce(
    (total, current) => {
      const weightedVote = current.status?.weight || 1;
      if (Number(current.direction) === 1) {
        total.direction1 = total.direction1 + weightedVote;
      } else {
        total.direction0 = total.direction0 + weightedVote;
      }

      return total;
    },
    {
      direction0: 0,
      direction1: 0,
    }
  );
};

export const calcWeightedIndication = async (
  total: { direction0: number; direction1: number },
  remote: { direction0: number; direction1: number },
  weight: number
) => {
  const direction0 =
    remote.direction0 * weight + total.direction0 * (1 - weight);
  const direction1 =
    remote.direction1 * weight + total.direction1 * (1 - weight);

  if (direction0 + direction1 === 0) {
    return 50;
  }
  return Number(
    Number(100 * (direction0 / (direction0 + direction1))).toFixed(2)
  );
};

export type AskBid = {
  askCount: number;
  bidCount: number;
};

export const getRemote = (coin: string, pair?: boolean) => {
  return new Promise<{ direction0: number; direction1: number }>((resolve) => {
    const symbol = pair ? `X:${coin.replace("-", "")}` : `X:${coin}USD`;
    try {
      rest
        .snapshotTickerFullBookL2(symbol)
        .then((snapshot) => {
          const direction0 = (snapshot.data as AskBid)?.bidCount || 0;
          const direction1 = (snapshot.data as AskBid)?.askCount || 0;
          resolve({ direction0, direction1 });
        })
        .catch(() => resolve({ direction0: 0, direction1: 0 }));
    } catch (e) {
      resolve({ direction0: 0, direction1: 0 });
    }
  });
};
export const getUniqCoins = async () => {
  const allData = await firestore().collection("settings").doc("coins").get();
  return allData ?
    uniq(
      (allData.data() as { coins: { symbol: string }[] }).coins.map(
        (d) => d.symbol
      )
    ) :
    [];
};

export const getUniqPairsBothCombinations = async () => {
  const firstCombination = await getUniqPairs();
  const secondCombination = firstCombination.map((pair) =>
    pair.split("-").reverse().join("-")
  );
  return [...firstCombination, ...secondCombination];
};

export const getUniqPairs = async () => {
  const allData = await firestore().collection("settings").doc("pairs").get();
  return allData ?
    uniq(
      (
        allData.data() as { pairs: { symbol1: string; symbol2: string }[] }
      ).pairs.map((d) => `${d.symbol1}-${d.symbol2}`)
    ) :
    [];
};

export const roundMinutes: (date: Date) => number = (date: Date) => {
  date.setHours(date.getHours() + Math.floor(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date.getTime();
};

export const roundDay: (date: Date) => number = (date: Date) => {
  return new Date(
    ((d) => {
      const two = (n: number) => (n < 10 ? "0" : "") + n;

      return (
        two(d.getFullYear()) + "/" + two(d.getMonth() + 1) + "/" + d.getDate()
      );
    })(date)
  ).getTime();
};

export const calcIndication: (
  direction0: number,
  direction1: number
) => number = (direction0: number, direction1: number) => {
  let result = (direction0 / (direction0 + direction1 || 1)) * 100;
  if (!result) {
    result = 50;
  }
  return Number(Number(result).toFixed(3));
};

export const getDatesArray = (
  timeframe = 3600,
  start?: number,
  end?: number
) => {
  start = start || getStartTime(timeframe);
  end = end || Date.now();

  if (!validateTimestamps(start, end)) {
    return [];
  }

  const interval = timeframe * 1000;
  const dateEnd = new Date(end).getTime();

  end = roundMinutes(new Date(dateEnd));

  const arr: number[] = [];

  let x = end;
  while (x > start) {
    arr.push(x);
    x -= interval;
  }

  return [dateEnd, ...arr];
};

const validateTimestamps = (start: number, end: number = Date.now()) => {
  if (end < start) return false;

  return end <= Date.now();
};

export const getVotesForCPVI = async (
  start: number = moment().unix() * 1000,
  end: number = moment().subtract(1, "h").unix() * 1000
) => {
  const votes = await firestore()
    .collection("votes")
    .where("expiration", ">=", end)
    .where("expiration", "<", start)
    .withConverter(voteConverter)
    .get();

  return votes.docs.map((v) => v.data());
};

export const getPairsVotesForCPVI = async (start: number, end: number) => {
  const votes = await firestore()
    .collection("votes")
    .where("expiration", ">=", end)
    .where("expiration", "<", start)
    .withConverter(voteConverter)
    .get();

  return votes.docs
    .map((v) => v.data())
    .filter((v) => {
      return v.coin.includes("-");
    });
};

export const getStartTime = (hours = 3600) => {
  return (
    moment()
      .subtract(hours / 3600, "hours")
      .unix() * 1000
  );
};

export const cpviTaskCoin = async (
  callback: (result: { [key: string]: CPVIObj }) => void
) => {
  const result: { [key: string]: CPVIObj } = {};
  const uniqCoins = await getUniqCoins();
  console.log("uniqCoins --->", uniqCoins);
  const arr = [
    ...uniqCoins.map((coin) => {
      return async () => (result[coin] = await getCPVI(coin));
    }),
    () => callback(result),
  ];
  sequence_operate(arr, 0, 50);
};

export const cpviTaskPair = async (
  callback: (result: { [key: string]: CPVIObj }) => void
) => {
  const result: { [key: string]: CPVIObj } = {};
  const uniqCoins = await getUniqPairs();
  const arr = [
    ...uniqCoins.map((coin) => {
      return async () => (result[coin] = await getCPVI(coin));
    }),
    () => callback(result),
  ];

  sequence_operate(arr, 0, 50);
};

export const cpviRealTimeData = async ({
  id,
  lastTimeFrame,
}: {
  id: string;
  lastTimeFrame: number;
}) => {
  const orderBookCoin = await firestore()
    .collection("askBidStats")
    .doc("results")
    .collection(id)
    .where(
      "timestamp",
      ">",
      firestore.Timestamp.fromDate(new Date(lastTimeFrame))
    )
    .get();

  const finalData = orderBookCoin.docs
    .map((d) => d.data())
    .map((doc) => {
      const value =
        doc.direction0 > doc.direction1 ?
          (doc.direction1 = doc.direction1 * 0.25) :
          (doc.direction0 = doc.direction0 * 0.25);
      return {
        time: moment(new Date(doc.timestamp.seconds * 1000)).format("x"),
        value,
      };
    });
  return finalData;
};

// export const getCPVIForVote = async ({id, voteForTimeInHour}: { id: string, voteForTimeInHour: number}) => {
//   const end = moment().utc().format();
//   // const voteForTimeInHour = 1
//   const fromTimeData = (voteForTimeInHour/3600) * 50;
//   const timeFrame = voteForTimeInHour;
//   const start = moment().subtract(fromTimeData, "hours").utc().format();
//   const votes = await firestore()
//       .collection("votes")
//       .where("coin", "==", id)
//       .get();

//   const dates = getDatesArray(timeFrame, new Date(start).getTime(), new Date(end).getTime());

//   const docs = votes.docs
//       .map((d) => d.data() as VoteProps as VoteResultProps)
//       .map((doc) => {
//         return {
//           time: doc.voteTime,
//           direction: doc.direction,
//         };
//       });

//   return Object.values(
//       dates.reduce((total, current, index) => {
//         const key = moment(current).format();
//         const totalVoteInFrameFilter = docs.filter((e) => {
//           return Number(e.time) <= current && (dates.length === Number(index + 1) ? Number(e.time) > dates[index - 1] : Number(e.time) > (current - timeFrame * 1000));
//         });
//         const totalVoteInFrame = totalVoteInFrameFilter.length;
//         const totalBullVoteInFrame = totalVoteInFrameFilter.filter((e) => e.direction == 0).length;

//         total[key] = {
//           time: (new Date(key).getTime() / 1000) as UTCTimestamp,
//           value: totalVoteInFrame ? (totalBullVoteInFrame / totalVoteInFrame) * 100 : 50,
//         };

//         return total;
//       }, {} as { [key: string]: LineData })
//   ).sort((a, b) => Number(a.time) - Number(b.time));
// };

export const getCPVIForVote = async ({ id }: { id: string }) => {
  const end = Number(moment().utc().format("x"));
  const orderBookWeight = 0;
  const fromTimeData = 24 * 50;
  const timeFrame = 24;
  const start = Number(
    moment().subtract(fromTimeData, "hours").utc().format("x")
  );

  console.info("start", start);

  const hoursTimeFrame: any = {
    3600: "hourly",
    14400: "fourHourly",
    86400: "daily",
    604800: "weekly",
  };
  const table = hoursTimeFrame[86400];
  const votes = await firestore()
    .collection("votes")
    .where("coin", "==", id)
    .where("voteTime", ">=", start)
    .withConverter(voteConverter)
    .get();

  console.log("votes.docs", votes.docs);
  const toArray = votes.docs[0].data().coin.split("-");
  const docs = votes.docs
    .map((d) => d.data() as VoteProps as VoteResultProps)
    .map((doc) => {
      return {
        time: doc.voteTime,
        direction: doc.direction,
        weight: doc.status?.weight,
        CPM: doc.status?.givenCPM,
      };
    });
  if (Array.isArray(toArray) && toArray.length === 2) {
    const orderBookCoin1 = await firestore()
      .collection("askBidStats")
      .doc(table)
      .collection(toArray[0])
      .where("timestamp", "<", firestore.Timestamp.fromDate(moment().toDate()))
      .where(
        "timestamp",
        ">",
        firestore.Timestamp.fromDate(
          moment().subtract(fromTimeData, "hours").toDate()
        )
      )
      .get();
    const orderBookCoin2 = await firestore()
      .collection("askBidStats")
      .doc(table)
      .collection(toArray[1])
      .where("timestamp", "<", firestore.Timestamp.fromDate(moment().toDate()))
      .where(
        "timestamp",
        ">",
        firestore.Timestamp.fromDate(
          moment().subtract(fromTimeData, "hours").toDate()
        )
      )
      .get();
    if (!orderBookCoin1.docs.length || !orderBookCoin2.docs.length) {
      console.log("orderBookData.docs --->", "No data");
    } else {
      console.log("orderBookData.docs --->", "OK");
    }
    let totalVote = 0;
    let upvote = 0;

    let { orderBookCoin1UpVote } = orderBookCoin1.docs.reduce(
      (total, doc) => {
        const { direction0 } = doc.data() as CPVIObj;
        return {
          orderBookCoin1UpVote: total.orderBookCoin1UpVote + direction0,
        };
      },
      {
        orderBookCoin1UpVote: 0,
      }
    );
    let { orderBookCoin2UpVote } = orderBookCoin2.docs.reduce(
      (total, doc) => {
        const { direction0 } = doc.data() as CPVIObj;
        return {
          orderBookCoin2UpVote: total.orderBookCoin2UpVote + direction0,
        };
      },
      {
        orderBookCoin2UpVote: 0,
      }
    );
    // let orderBookCPVI = null;
    let orderBookCPVI = 100;
    if (orderBookCoin1UpVote > 0 || orderBookCoin2UpVote > 0) {
      orderBookCoin1UpVote > orderBookCoin2UpVote ?
        Math.trunc((orderBookCoin2UpVote = orderBookCoin2UpVote * 0.25)) :
        Math.trunc((orderBookCoin1UpVote = orderBookCoin1UpVote * 0.25));
      orderBookCPVI =
        (orderBookCoin1UpVote / (orderBookCoin1UpVote + orderBookCoin2UpVote)) *
        100;
    }
    docs.map((e) => {
      if (e?.CPM) totalVote += Number(e?.CPM);
      e.direction == 0 && e?.CPM ? (upvote += Number(e?.CPM)) : null;
    });
    const normalCPVI = (upvote / totalVote) * 100;
    let finalCPVI = 50;
    if (totalVote > 0 && orderBookCPVI) {
      finalCPVI = Math.trunc((normalCPVI + orderBookCPVI) / 2);
    } else if (orderBookCPVI) {
      finalCPVI = orderBookCPVI;
    } else if (totalVote > 0) {
      finalCPVI = normalCPVI;
    }
    return finalCPVI;
  } else {
    const orderBookData = await firestore()
      .collection("askBidStats")
      .doc(table)
      .collection(id)
      .where("timestamp", "<", firestore.Timestamp.fromDate(moment().toDate()))
      .where(
        "timestamp",
        ">",
        firestore.Timestamp.fromDate(
          moment().subtract(fromTimeData, "hours").toDate()
        )
      )
      .get();
    const orderBook = orderBookData.docs
      .map((d) => d.data())
      .map((doc) => {
        return {
          time: moment(new Date(doc.timestamp.seconds * 1000)).format("x"),
          upVote: doc.direction0,
          downVote: doc.direction1,
          weight: 1,
          CPM: 1,
        };
      });
    const dates = getDatesArray(timeFrame, start, end);
    const finalArray = Object.values(
      dates.reduce((total, current, index) => {
        const key = moment(current).format();
        const totalVoteInFrameFilter = docs.filter((e) => {
          return Number(e.time) <= current && dates.length === Number(index + 1) ?
            Number(e.time) > dates[index - 1] :
            Number(e.time) > current - timeFrame * 1000;
        });
        const orderBookTimeFrameData: any = orderBook.find((e) => {
          return Number(e.time) <= current && dates.length === Number(index + 1) ?
            Number(e.time) > dates[index - 1] :
            Number(e.time) > current - timeFrame * 1000;
        });
        let totalVoteInFrame = 0;
        let totalBullVoteInFrame = 0;
        totalVoteInFrameFilter.map((e) => {
          if (e?.CPM) totalVoteInFrame += Number(e?.CPM);
          e.direction == 0 && e?.CPM ?
            (totalBullVoteInFrame += Number(e?.CPM)) :
            null;
        });
        const realValue = totalVoteInFrame ?
          (totalBullVoteInFrame / totalVoteInFrame) * 100 :
          0;
        let orderBookValue = 0;
        if (orderBookTimeFrameData?.time) {
          let calculatedUpVote = Number(orderBookTimeFrameData.upVote);
          let calculatedDownVote = Number(orderBookTimeFrameData.downVote);
          if (orderBookTimeFrameData.upVote > orderBookTimeFrameData.downVote) {
            calculatedDownVote = orderBookTimeFrameData.downVote * 0.25;
          } else {
            calculatedUpVote = orderBookTimeFrameData.upVote * 0.25;
          }
          console.log("calculatedUpVote =>", calculatedUpVote);
          console.log("calculatedDownVote =>", calculatedDownVote);
          console.log(
            "calculatedUpVote + calculatedDownVote =>",
            calculatedUpVote + calculatedDownVote
          );
          orderBookValue =
            (calculatedUpVote / (calculatedUpVote + calculatedDownVote)) * 100;
        }
        let totalValue = 0;
        if (orderBookValue && realValue) {
          // totalValue = (realValue + orderBookValue) / 2;
          // Calculating By orderBook Weight
          totalValue = Number(
            (
              (realValue * (100 - orderBookWeight) +
                orderBookValue * orderBookWeight) /
              100
            ).toFixed(2)
          );
        } else if (orderBookValue) {
          totalValue = orderBookValue;
        } else {
          totalValue = 50;
        }
        total[key] = {
          time: (new Date(key).getTime() / 1000) as UTCTimestamp,
          value: totalValue,
        };
        return total;
      }, {} as { [key: string]: LineData })
    ).sort((a, b) => Number(a.time) - Number(b.time));
    const secondLastTimeframe =
      Number(finalArray[finalArray.length - 2].time) * 1000;
    const lastTimeFrameByVoting = docs
      .filter((e) => Number(e.time) > secondLastTimeframe)
      .sort((a, b) => Number(a.time) - Number(b.time));
    const pushArr: any = [];
    let value = 0;
    let upvote = 0;
    let totalWeight = 0;
    lastTimeFrameByVoting.forEach((e, i) => {
      e.direction == 0 && e?.weight ? (upvote += Number(e.weight)) : null;
      if (e?.weight) {
        totalWeight += Number(e.weight);
        value = (upvote / totalWeight) * 100;
      }
      pushArr.push({
        time: e.time,
        value: value,
      });
    });
    await finalArray.pop();

    return [...finalArray, ...pushArr];
  }
};

export const CPVIForCoin = async (coinName: string) => {
  try {
    console.log("coinName: " , coinName);
    // get all the data in between24 hours
    const currentTime = Date.now();
    const before24hoursTime = currentTime - 24 * 3600000;
    console.log("current time: " + currentTime)
    console.log("before24hours time: " + before24hoursTime)
    const getAllCoinListing = (
      await firestore()
        .collection('votes')
        .where("expiration", ">=", currentTime)
        .where("expiration", "<=", before24hoursTime)
        .get()
    ).docs.map((coin) => coin.data());

    console.log("getAllCoinListing : ",getAllCoinListing)
    const getCoinListing = getAllCoinListing.filter((coin: any) => coin.coin == coinName);
    console.log("getCoinListing : ", getCoinListing);

    const countVoteObj = {
      bear: 0,
      bull: 0
    }

    if(!getCoinListing.length) {
      return {
        totalVote: getCoinListing.length,
        coin: coinName,
        result : [],
        message : "No data found in last 24 hours"
      }
    }

    getCoinListing.forEach((coin: any) => {
      if (coin.direction == 1) countVoteObj.bull += 1
      if (coin.direction == 0) countVoteObj.bear += 1
    })

    if (coinName.split("-").length > 0) {
      let coins = coinName.split("-");
      let result: any = Object.keys(coins);
      result[coins[0]] = (countVoteObj.bull / getCoinListing.length) * 100;
      result[coins[1]] = (countVoteObj.bear / getCoinListing.length) * 100;
      return {
        ...result,
        totalVote: getCoinListing.length,
        coin: coinName
      }

    }

    return {
      bull: (countVoteObj.bull / getCoinListing.length) * 100,
      bear: (countVoteObj.bear / getCoinListing.length) * 100,
      totalVote: getCoinListing.length,
      coin: coinName
    };


  } catch (error) {
    console.log("CPVIForCoin Error : ", error)
    return { status: false, message: "Something went wrong", error }
  }
}


// export const getCPVIForVote = async ({id}: { id: string }) => {
//   const end = moment().utc().format();
//   const start = moment().subtract(30, "d").utc().format();
//   const cpvi = await firestore()
//       .collection("cpvi")
//       .doc("results")
//       .collection(id + "")
//       .where("timestamp", ">=", firestore.Timestamp.fromDate(new Date(start)))
//       .where("timestamp", "<=", firestore.Timestamp.fromDate(new Date(end)))
//       .get();

//   const dates = getDatesArray(
//       3600,
//       new Date(start).getTime(),
//       new Date(end).getTime()
//   );

//   const docs = cpvi.docs
//       .map((d) => d.data() as CPVIObj)
//       .map((doc) => {
//         return {
//           time: moment(doc.timestamp.toMillis()).format(),
//           value: 100 * doc.direction0 / doc.direction1,
//         };
//       });

//   return Object.values(
//       dates.reduce((total, current) => {
//         const key = moment(current).format();
//         total[key] = {
//           time: (new Date(key).getTime() / 1000) as UTCTimestamp,
//           value: docs.find((d) => d.time === key)?.value || 50,
//         };
//         return total;
//       }, {} as { [key: string]: LineData })
//   ).sort((a, b) => Number(a.time) - Number(b.time));
// };
