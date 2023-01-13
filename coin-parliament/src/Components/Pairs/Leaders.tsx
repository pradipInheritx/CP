import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import CoinsContext, { Leader } from "../../Contexts/CoinsContext";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import Leaderboard from "../Leaderboard";
import { throttle } from "lodash";
import styled from "styled-components";
import UserContext from "../../Contexts/User";
import { setChecked } from "../../common/models/User";

const Title = styled.h2`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / 18px var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-160133);
  opacity: 1;
  text-align: center;

  &:first-letter {
    text-transform: capitalize;
  }
`;

const getLeadersByCoin = httpsCallable(functions, "getLeadersByCoin");

const leadersInstall = async ({
  leaders,
  symbol,
}: {
  leaders: Leader[];
  symbol: string;
}) => {
  const leadersByCoin = await getLeadersByCoin({ symbol });
  return (leadersByCoin.data as unknown as { pct: number; user: string }[])
    .map((leader) => {
      const { user, pct } = leader;
      return { leader: leaders.find((l) => l.userId === user), pct };
    })
    .filter((l) => l.leader)
    .sort((a, b) => {
      return b.pct - a.pct;
    })
    .map((l) => {
      return l.leader as Leader;
    });
};

const install = throttle(leadersInstall, 5000);

const Leaders = ({
  symbol,
  texts,
}: {
  symbol: string;
  texts: { topInfluencers: string };
}) => {
  const { leaders } = useContext(CoinsContext);
  const { user, userInfo } = useContext(UserContext);
  const [coinLeaders, setCoinLeaders] = useState<Leader[]>([]);
  const mountedRef = useRef(true);

  const initLeaders = useCallback(() => {
    if (!mountedRef.current) return null;
    if (leaders.length) {
      install({ leaders, symbol })?.then((c) => {
        setCoinLeaders(c);
      });
    }
  }, [leaders, symbol]);

  useEffect(() => {
    initLeaders();
    return () => {
      mountedRef.current = false;
    };
  }, [initLeaders]);

  return coinLeaders.length && user && userInfo ? (
    <>
      <div className="mb-4">
        <Title>{texts.topInfluencers}</Title>
      </div>

      <Leaderboard
        {...{
          leaders: coinLeaders,
          userInfo,
          setChecked: setChecked(leaders, user),
        }}
      />
    </>
  ) : (
    <></>
  );
};

export default Leaders;
