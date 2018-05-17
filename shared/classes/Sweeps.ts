import { user_sweep_display } from './DB';

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
    lastUserSweep?: Partial<user_sweep_display>;
    nameSearch?: string;
    dateSearch?: {
        year: number;
        month?: number;
    }
}