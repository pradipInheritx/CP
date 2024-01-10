import * as admin from "firebase-admin";
import Timestamp = admin.firestore.Timestamp;
import {UserTypeProps} from "./User.interface";
export type VoteStatistics = {
    total: number;
    successful: number;
    score: number;
    rank: number;
    commission: number;
    pax: number;
  };

  export type VoteProps = {
    coin: string;
    userId: string;
    timeframe: TimeFrame;
    direction: Direction;
    valueVotingTime: number | number[];
    status?: UserTypeProps;
    trendChange?: number;
  };
  export type VoteResultProps = VoteProps & {
    voteTime: Timestamp;
    expiration: Timestamp;
    valueExpirationTime?: number | number[];
    direction?: any;
    success?: number;
    score?: number;
    CPMRangePercentage?: number;
    CPMRangeCurrentValue?: number;
  };
  
  export type TimeFrame = {
    index: number;
    name: string;
    seconds: number;
  };
  
  export enum Direction {
    BULL,
    BEAR,
  }