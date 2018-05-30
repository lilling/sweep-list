import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_sweep } from '../../../shared/classes';
import { BaseService } from './base.service';

@Injectable()
export class SweepsService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/sweep/');
    }

    getLiveSweeps(data: {user_account_id: string, lastUserSweep?: user_sweep}): Observable<user_sweep[]> {
        return this.post<user_sweep[]>(`live_user_sweeps`, data);
    }

    addOrUpdateSweep(user_sweep: user_sweep): Observable<user_sweep> {
        return this.post<user_sweep>('sweep', user_sweep);
    }
}
