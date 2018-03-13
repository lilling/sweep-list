import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_account, SocialUserAndAccount} from '../../../shared/classes';
import { BaseService } from './base.service';

@Injectable()
export class UsersService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/user/');
    }

    login(model: SocialUserAndAccount): Observable<user_account> {
        return this.post<user_account>(`SocialMediaLogin`, model);
    }
}
