import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_account, SocialUserAndAccount } from '../../../shared/classes';
import { BaseService } from './base.service';
import { SocialMedia } from '../../../shared/models/social-media.enum';

@Injectable()
export class UsersService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/user/');
    }

    login(model: SocialUserAndAccount): Observable<user_account> {
        return this.post<user_account>(`SocialMediaLogin`, model);
    }

    getUserSocialAccounts(id: number): Observable<SocialMedia[]> {
        return this.get(`user_social_medias/${id}`);
    }

    getUser(id: number): Observable<user_account> {
        return this.get<user_account>(`user_accounts/${id}`);
    }

    deleteAccount(id: number) {
        return this.post('deleteUserAccount', { user_account_id: id });
    }

    getDeleteAccountData(id: number): Observable<{ tasks: string, active: string, ended: string, won: string }> {
        return this.get(`deleteUserAccountConfirm/${id}`);
    }
}
