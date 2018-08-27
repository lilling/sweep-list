import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_account, ExtandedSocialUser } from '../../../shared/classes';
import { BaseService } from './base.service';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { SocialMediaStatus } from '../../../shared/models/social-media-status.enum';

@Injectable()
export class UsersService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'api/user/');
    }

    login(model: ExtandedSocialUser): Observable<{ user: user_account, isNew?: boolean }> {
        return this.post<{ user: user_account, isNew?: boolean }>(`Login`, model);
    }

    register(model: ExtandedSocialUser): Observable<{ user: user_account, isNew?: boolean }> {
        return this.post<{ user: user_account, isNew?: boolean }>(`create_user`, model);
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
