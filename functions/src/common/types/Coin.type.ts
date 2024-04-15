
export type Coin = {
    name: string;
    symbol: string;
    id: number;
    price: number;
    trend?: number;
  };
  
  export type CoinSnap = {
    timestamp: string;
    data: { [symbol: string]: Coin };
  };
  
  export type Leader = {
    displayName?: string;
    email: string;
    userId: string;
    avatar?: string;
    score: number;
    subscribers?: number;
  };
  
  export type IWazirXSnapshotTickers = {
    id?: number;
    name?: string;
    price?: string;
    symbol?: string;
  };
  
  export type IWazirXSnapshotMetaData = {
    count?: number;
    status?: string;
    tickers?: IWazirXSnapshotTickers[];
  };
  
  export type CoinsWithKey = {
    [key: string]: {
      id: number;
      price: any;
      symbol: string;
      name: string;
    };
  };
  
  export type CoinsWithFixedDecimalValue = {
    [key: string]: {
      fixedValue: number;
    };
  };
  