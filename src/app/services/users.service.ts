import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_account, SocialUserAndAccount } from '../../../shared/classes';
import { BaseService } from './base.service';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { SocialMediaStatus } from '../../../shared/models/social-media-status.enum';

@Injectable()
export class UsersService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/user/');
    }

    login(model: {userAccount: SocialUserAndAccount, regular: {email: string, password: string}}): Observable<user_account> {
        return this.post<user_account>(`Login`, model);
    }

    getUserSocialAccounts(id: AAGUID): Observable<{socialMedia: SocialMedia, status: SocialMediaStatus}[]> {
        return this.get(`user_social_medias/${id}`);
    }

    getUser(id: AAGUID): Observable<user_account> {
        return this.get<user_account>(`user_accounts/${id}`);
    }

    deleteAccount(id: AAGUID) {
        return this.post('deleteUserAccount', { user_account_id: id });
    }

    getDeleteAccountData(id: AAGUID): Observable<{ tasks: string, active: string, ended: string, won: string }> {
        return this.get(`deleteUserAccountConfirm/${id}`);
    }
}
