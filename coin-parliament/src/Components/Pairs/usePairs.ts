import { useCallback, useContext } from "react";
import CoinsContext from "../../Contexts/CoinsContext";
import { getPairs } from "../../common/models/PairTable";

export const usePairs = () => {
  const { allPairs, coins } = useContext(CoinsContext);
  return useCallback(
    (chosen?: string[][]) => {      
      return getPairs(allPairs, coins, chosen);
    },
    [coins, allPairs]
  );
};
