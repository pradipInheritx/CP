import {Coin} from "../../common/models/Coin";
import { flatMap, throttle } from "lodash";


import EXTRA from "../../assets/images/EXTRA.png";
import EXTRA1 from "../../assets/images/EXTRA1.png";
import EXTRA2 from "../../assets/images/EXTRA2.png";
import EXTRA3 from "../../assets/images/EXTRA3.png";
import EXTRA4 from "../../assets/images/EXTRA4.png";
import EXTRA5 from "../../assets/images/EXTRA5.png";


export const symbolCombination = (coins: string[]) =>
  coins.length === 2 ? `${coins[0]}-${coins[1]}` : "";

export const getSymbolsCombinations = (coins: Coin[]) => {
  const allPairs = flatMap(
    coins.map((c1) => coins.map((c2) => [c1, c2]).filter((c) => c)),
  )
    .filter((c) => c.length === 2)
    .filter(([c1, c2]) => c1.symbol !== c2.symbol);

  const filtered = allPairs.reduce((total, [c1, c2]) => {
    if (
      !total[symbolCombination([c1.symbol, c2.symbol])] &&
      !total[symbolCombination([c2.symbol, c1.symbol])]
    ) {
      total[symbolCombination([c1.symbol, c2.symbol])] = [c1, c2];
    }
    return total;
  }, {} as { [key: string]: Coin[] });

  return Object.values(filtered);
};

export const queryToPair = (query: string) => {
  let [val1, val2] = query.split("-").map((q) => q.toUpperCase());
  if (!val2) {
    [val1, val2] = query.split(" ").map((q) => q.toUpperCase());
  }
  return [val1, val2];
};

export const getChosenPairs = (allPairs: string[][], filter: string) => {
  const [val1, val2] = queryToPair(filter);
  return allPairs.filter((pair) => {
    const [coin1, coin2] = pair;
    return (
      coin1.indexOf(val1) !== -1 ||
      coin2.indexOf(val1) !== -1 ||
      coin1.indexOf(val2) !== -1 ||
      coin2.indexOf(val2) !== -1
    );
  });
};

export const voteProcedure = ({vote, sound, setConfetti}: {
  vote: () => Promise<void>; sound: React.RefObject<HTMLAudioElement>; setConfetti: (bool: boolean) => void;
}) => throttle(async () => {
  await vote();
  // sound.current?.play().then(void 0);
  // setConfetti(true);
  // setTimeout(() => {
  //   setConfetti(false);
  // }, 6000);
}, 1000);


export const listData = [
  {
    name1: "ABC",
    name2: "BCA",
    price1: "123.002",
    price2: "232.003",
    img1: EXTRA,
    img2: EXTRA1,
  },
  {
    name1: "XYZ",
    name2: "ZYX",
    price1: "213.001",
    price2: "423.001",
    img1: EXTRA2,
    img2: EXTRA3,
  },
  {
    name1: "DEF",
    name2: "FDE",
    price1: "324.012",
    price2: "132.103",
    img1: EXTRA4,
    img2: EXTRA5,
  }
]