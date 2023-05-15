interface Decimal {
    Symbol: string;
    decimal: number;
    multiply: number;
    [key: string]: any; // index signature to allow any string key
}

export const Decimal: { [key: string]: Decimal } = {
    "BTC":
    {
        Symbol: 'BTC',
        decimal: 2,
        multiply: 100
    },
    "ETH":
    {
        Symbol: 'ETH',
        decimal: 2,
        multiply: 100
    },
    "BNB": {
        Symbol: 'BNB',
        decimal: 1,
        multiply: 10
    },
    "ADA": {
        Symbol: 'ADA',
        decimal: 6,
        multiply: 1000000
    },
    "SOL": {
        Symbol: 'SOL',
        decimal: 2,
        multiply: 100
    },
    "XRP": {
        Symbol: 'XRP',
        decimal: 4,
        multiply: 10000
    },
    "DOGE": {
        Symbol: 'DOGE',
        decimal: 5,
        multiply: 100000
    },
    "DOT": {
        Symbol: 'DOT',
        decimal: 3,
        multiply: 1000
    },
    "SHIB": {
        Symbol: 'SHIB',
        decimal: 7,
        multiply: 10000000
    },
    "MATIC": {
        Symbol: 'MATIC',
        decimal: 4,
        multiply: 10000
    },
    "CRO": {
        Symbol: 'CRO',
        decimal: 4,
        multiply: 10000
    },
    "LTC": {
        Symbol: 'LTC',
        decimal: 2,
        multiply: 100
    },
    "LINK": {
        Symbol: 'LINK',
        decimal: 2,
        multiply: 100
    },
    "UNI": {
        Symbol: 'UNI',
        decimal: 2,
        multiply: 100
    },
    "TRX": {
        Symbol: 'TRX',
        decimal: 5,
        multiply: 100000
    },
    "XLM": {
        Symbol: 'XLM',
        decimal: 4,
        multiply: 10000
    },
    "MANA": {
        Symbol: 'MANA',
        decimal: 2,
        multiply: 100
    },
    "HBAR": {
        Symbol: 'HBAR',
        decimal: 4,
        multiply: 10000
    },
    "VET": {
        Symbol: 'VET',
        decimal: 5,
        multiply: 100000
    },
    "SAND": {
        Symbol: 'SAND',
        decimal: 2,
        multiply: 100
    },
    "EOS": {
        Symbol: 'EOS',
        decimal: 2,
        multiply: 100
    },
    "CAKE": {
        Symbol: 'CAKE',
        decimal: 3,
        multiply: 1000
    },
}