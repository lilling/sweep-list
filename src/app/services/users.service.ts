import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';
//
import { user_account, SocialUserAndAccount} from '../../../shared/classes';
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
}
