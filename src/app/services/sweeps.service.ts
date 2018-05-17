import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_sweep_display, user_sweep } from '../../../shared/classes';
import { BaseService } from './base.service';

@Injectable()
export class SweepsService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/sweep/');
    }

    getLiveSweeps(data: {userId: string, lastSweep?: user_sweep_display}): Observable<user_sweep_display[]> {
        const body: any = {
            user_account_id: data.userId
        };
        if (data.lastSweep) {
            body.deleted_yn = data.lastSweep.deleted_yn;
            body.last_entry_date = data.lastSweep.last_entry_date;
            body.end_date = data.lastSweep.end_date;
            body.user_sweep_id = data.lastSweep.user_sweep_id;
        }

        return this.post<user_sweep_display[]>(`live_user_sweeps`, body);
    }

    addOrUpdateSweep(user_sweep: user_sweep): Observable<user_sweep_display> {
        return this.post<user_sweep_display>('sweep', user_sweep);
    }
}
