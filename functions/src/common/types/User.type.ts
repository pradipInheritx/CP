import {wellDAddressType} from './Payment.type';
import {VoteStatistics} from './Vote.type'
import {RewardStatistics,referalReceiveType} from './Reward.type'
export type UserTypeProps = {
    index: number;
    name: string;
    givenCPM: number;
    weight: number;
    color?: Colors;
    share: number;
    minVote?: number;
  };
  
  export enum Colors {
    PLATINUM = "Platinum",
    GOLD = "Gold",
    SILVER = "Silver",
  }
  
  export type UserProps = {
    uid?: string;
    paid?: boolean;
    userName?: string;
    displayName?: string;
    address?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    country?: string;
    children: string[];
    status?: UserTypeProps;
    parent?: string;
    mfa: boolean;
    voteStatistics?: VoteStatistics;
    leader?: string[];
    subscribers?: string[];
    favorites: string[];
    token?: string;
    wallet?: string;
    rewardStatistics?: RewardStatistics;
    firstTimeLogin?: boolean;
    refereeScrore?: number;
    googleAuthenticatorData?: any;
    voteValue?: number;
    lastVoteTime?: number;
    wellDAddress?: wellDAddressType;
    referalReceiveType?: referalReceiveType;
    foundationData?: any;
    isUserUpgraded?: any;
  };

  export type Totals = {
    total: number;
    success: number;
  };
  
  export type Leader = {
    displayName: string;
    email: string;
    userId: string;
    avatar?: string;
    score: number;
    pct: number;
    subscribers?: number;
    leaders?: number;
    status?: string;
    total?: number;
    isUserUpgraded?: any;
  };