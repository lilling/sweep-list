import  FB from 'fb';
import { FacebookExtention } from '../../classes';

export class FacebookService {
    appId: number;
    appSecret: string;

    constructor() {
        /*FB.options({
            appId: 1940493829534171,
            appSecret: '021ed0b1952127c7ad9df8d0f6db7d97',
        });*/
        this.appId = 1940493829534171;
        this.appSecret = '021ed0b1952127c7ad9df8d0f6db7d97';
    }

    extendAccessToken(client_access_token: string): Promise<FacebookExtention>{
        return new Promise<FacebookExtention>((resolve, reject) => {
            FB.api('oauth/access_token', {
                client_id: this.appId,
                client_secret: this.appSecret,
                grant_type: 'fb_exchange_token',
                fb_exchange_token: client_access_token
            }, (res) => {
                let retInner = new FacebookExtention;
                const expires = new Date();
                if(!res || res.error) {
                    retInner.access_token = null;
                    retInner.expiration_date = expires;
                    retInner.auth_error = res.error;
                } else {
                    retInner.access_token = res.access_token;
                    expires.setTime(expires.getTime() + res.expires_in * 1000);
                    retInner.expiration_date = expires;
                    retInner.auth_error = null;
                }
                return resolve(retInner);
            });
        });
    }
}

