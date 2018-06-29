import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
import { EnumValues } from 'enum-values';
//
import { user_sweep, Search } from '../../../shared/classes';
import { BaseService } from './base.service';
import { SweepsMode } from '../state/sweeps/sweeps.state';

@Injectable()
export class SweepsService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/sweep/');
    }

    getSweeps(data: Search, mode: SweepsMode): Observable<user_sweep[]> {
        const url = `${EnumValues.getNameFromValue(SweepsMode, mode)}_user_sweeps`;
        return this.post<user_sweep[]>(url, data).map(res => {
            res.forEach(sweep => {
                this.fixSweepTypes(sweep);
            });
            return res;
        });
    }

    addOrUpdateSweep(user_sweep: user_sweep): Observable<user_sweep> {
        return this.post<user_sweep>('sweep', user_sweep).map(res => {
            this.fixSweepTypes(res);
            return res;
        });
    }

    enterSweep(sweepId: number): Observable<URL> {
        return this.get(`user_sweep_url/${sweepId}`);
    }

    deleteSweep(id: number) {
        return this.get(`del_sweep/${id}`);
    }

    private fixSweepTypes(sweep: user_sweep) {
        sweep.last_entry_date = sweep.last_entry_date ? new Date(sweep.last_entry_date) : null;
        sweep.created = sweep.created ? new Date(sweep.created) : null;
        sweep.updated = sweep.updated ? new Date(sweep.updated) : null;
        sweep.end_date = sweep.end_date ? new Date(sweep.end_date) : null;
        sweep.total_entries = sweep.total_entries ? +sweep.total_entries : null;
        sweep.total_shares = sweep.total_shares ? +sweep.total_shares : null;
        sweep.referral_frequency = sweep.referral_frequency ? +sweep.referral_frequency : null;
        sweep.frequency_days = sweep.frequency_days ? +sweep.frequency_days : null;
        sweep.user_account_id = sweep.user_account_id ? +sweep.user_account_id : null;
    }
}
