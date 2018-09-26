import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
import { EnumValues } from 'enum-values';
//
import { user_sweep, Search, Win } from '../../../shared/classes';
import { BaseService } from './base.service';
import { SweepsMode } from '../state/sweeps/sweeps.state';
import { SocialMedia } from '../../../shared/models/social-media.enum';

@Injectable()
export class SweepsService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/sweep/');
    }

    getSweeps(data: Search, mode: SweepsMode): Observable<user_sweep[]> {
        const url = `${EnumValues.getNameFromValue(SweepsMode, mode)}_user_sweeps`;
        return this.post<user_sweep[]>(url, data).map(res => {
            res.forEach(sweep => this.fixSweepTypes(sweep));
            return res;
        });
    }

    addOrUpdateSweep(user_sweep: user_sweep): Observable<user_sweep> {
        return this.post<user_sweep>('sweep', user_sweep).map(res => {
            this.fixSweepTypes(res);
            return res;
        });
    }

    winOrUnwinSweep(win_action: string, sweepId: number, prizeValue?: number){
        return this.get<user_sweep>(`${win_action}_sweep/${sweepId}` + ((win_action == 'win') ? `/${prizeValue}` : ``)).map(res => {
            this.fixSweepTypes(res);
            return res;
        });
    }

    getUserWins(user_account_id: AAGUID): Observable<Win[]> {
        return this.get(`user_wins/${user_account_id}`);
    }

    enterSweep(sweepId: number): Observable<URL> {
        return this.get(`user_sweep_url_enter/${sweepId}`);
    }

    shareSweep(sweep_id: number, social_media: SocialMedia, URL: string) {
        return this.post(`user_sweep_url_share`, {sweep_id, social_media, URL})
    }

    deleteSweep(id: number) {
        return this.get(`del_sweep/${id}`);
    }

    getTimePassedSinceLastVisit(sweep: user_sweep) {
        if (!sweep.last_entry_date) {
            return '';
        }
        const diff = Date.now() - sweep.last_entry_date.getTime();

        let returnValue = '';
        const days = diff / 864e5;

        if (days > 1) {
            returnValue = `${days.toFixed(0)} days`;
        } else {
            const hours = diff / 36e5;
            if (hours > 1) {
                returnValue = `${hours.toFixed(0)} hours`;
            } else {
                const minutes = diff / 6e4;

                returnValue = `${minutes.toFixed(0)} minutes`;
            }
        }
        return returnValue;
    }

    private fixSweepTypes(sweep: user_sweep) {
        sweep.last_entry_date = sweep.last_entry_date ? new Date(sweep.last_entry_date) : null;
        sweep.created = sweep.created ? new Date(sweep.created) : null;
        sweep.updated = sweep.updated ? new Date(sweep.updated) : null;
        sweep.end_date = sweep.end_date ? new Date(sweep.end_date) : null;
        sweep.total_entries = sweep.total_entries ? +sweep.total_entries : null;
        sweep.total_shares = sweep.total_shares ? +sweep.total_shares : null;
        sweep.referral_frequency = sweep.referral_frequency ? +sweep.referral_frequency : null;
        sweep.last_facebook_share = sweep.last_facebook_share ? new Date(sweep.last_facebook_share) : null;
        sweep.last_google_share = sweep.last_google_share ? new Date(sweep.last_google_share) : null;
        sweep.last_linkedin_share = sweep.last_linkedin_share ? new Date(sweep.last_linkedin_share) : null;
        sweep.last_pinterest_share = sweep.last_pinterest_share ? new Date(sweep.last_pinterest_share) : null;
        sweep.last_twitter_share = sweep.last_twitter_share ? new Date(sweep.last_twitter_share) : null;
        sweep.frequency_days = sweep.frequency_days ? +sweep.frequency_days : null;
        sweep.user_account_id = sweep.user_account_id ? sweep.user_account_id : null;
    }
}
