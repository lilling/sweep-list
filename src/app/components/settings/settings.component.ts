import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
//
import { EnumValues } from 'enum-values';
import { NgRedux } from '@angular-redux/store/lib/src';
import * as _ from 'lodash';
//
import { SocialMedia } from '../../../../shared/models/social-media.enum';
import { LoginActions } from '../../state/login/login.actions';
import { Subscriber } from '../../classes/subscriber';
import { AppState } from '../../state/store';
import { user_account } from '../../../../shared/classes';
import { DeleteAccountComponent } from '../../delete-account/delete-account.component';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})
export class SettingsComponent extends Subscriber implements OnInit {
    EnumValues = EnumValues;
    SocialMedia = SocialMedia;
    selectedSMs: Map<number, boolean>;
    user: user_account;

    constructor(private router: Router,
                private ngRedux: NgRedux<AppState>,
                private loginActions: LoginActions,
                public dialog: MatDialog) {
        super();
    }

    ngOnInit() {
        this.subscriptions = {
            user: this.ngRedux.select(state => state.loginState.user).subscribe(user => {
                this.user = user;

                if (this.user) {
                    this.selectedSMs = EnumValues.getValues<SocialMedia>(SocialMedia).reduce((result, current) => {
                        const value = !!(this.user.enabled_social_media_bitmap & current);
                        if (value) {
                            result.set(current, value);
                        }
                        return result;
                    }, new Map<number, boolean>());
                }
            })
        };
    }

    updateUserSms() {
        this.loginActions.updateUser({ ...this.user, enabled_social_media_bitmap: _.sum(Array.from(this.selectedSMs.keys())) });
        this.router.navigate(['/todo', 1]);
    }

    deleteAccount() {
        this.dialog.open(DeleteAccountComponent);
    }
}
