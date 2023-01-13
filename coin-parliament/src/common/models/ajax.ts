export type CoinbaseResponse<T> = {
    data: T;
    status: {
        credit_count: number;
        elapsed: number;
        error_code: number;
        error_message: string | null;
        notice: string | null;
        timestamp: string;
        total_count: number;
    }
}