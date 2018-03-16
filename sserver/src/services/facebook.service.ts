import { graph } from 'fbgraph';
import  FB from 'fb';
import { FacebookExtention } from '../../classes';

export class FacebookService {
    appId: number;
    appSecret: string;

    constructor() {
        FB.options({
            appId: 1940493829534171,
            appSecret: '021ed0b1952127c7ad9df8d0f6db7d97',
        });
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
                if(!res || res.error) {
                    retInner.access_token = null;
                    retInner.expiration_seconds = 0;
                    retInner.auth_error = res.error;
                } else {
                    retInner.access_token = res.access_token;
                    retInner.expiration_seconds = res.expires_in;
                    retInner.auth_error = null;
                }
                return resolve(retInner);
            });
        });
    }

    publishPost(access_token: string, account_id: string, message: string, link: string): string{
        FB.setAccessToken(access_token);
        return FB.api(account_id + '/feed', 'post', { 
            message: message,
            link: link
        }, function (res) {
            if(!res || res.error) {
              console.log(!res ? 'error occurred' : res.error);
              return null;
            }
            console.log('Post Id: ' + res.id);
            return res.id;
          });
    };
}
