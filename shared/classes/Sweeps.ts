export class Win {
    win_year: number;
    win_month: string;
    month_numeric: number;
    prize_value_sum: number;
}

export class URL {
    user_sweep_id: number;
    sweep_url: string;
}

export class Search {
    user_account_id: number;
    user_sweep_id?: number;
    deleted_yn?: boolean;
    last_entry_date?: Date;
    end_date: Date;
    search?: string;
    year?: number;
    month?: number;
}