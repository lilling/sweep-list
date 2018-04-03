import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_account, SocialUserAndAccount, user_sweep_display, user_sweep } from '../../../shared/classes';
import { BaseService } from './base.service';

@Injectable()
export class SweepsService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/sweep/');
    }

    getLiveSweeps(id: string): Observable<user_sweep_display[]> {
        return this.get<user_sweep_display[]>(`live_user_sweeps/${id}`);
    }

    addOrUpdateSweep(user_sweep: user_sweep): Observable<user_sweep_display> {
        return this.post<user_sweep_display>('sweep', user_sweep);
    }
}
