import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatIconRegistry, MatSlideToggleChange, MatExpansionPanel } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../state/store';
import { user_sweep } from '../../../shared/classes';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { UsersService } from '../services/users.service';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';

@Component({
    selector: 'app-edit-sweep',
    templateUrl: 'edit-sweep.component.html',
    styleUrls: ['edit-sweep.component.scss']
})
export class EditSweepComponent implements OnInit {

    sweep: user_sweep;
    userAccountId: number;
    loggedSocialMedias: SocialMedia[];
    SocialMedia = SocialMedia;

    constructor(private ngRedux: NgRedux<AppState>,
                private usersService: UsersService,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon('contact-us', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/contact-us.svg'));
        this.userAccountId = +localStorage.getItem(LocalStorageKeys.loggedUser);
        this.usersService.getUserSocialAccounts(this.userAccountId).subscribe(socialMedias => {
            this.loggedSocialMedias = socialMedias;
        });
    }

    ngOnInit() {
        const sweepId = +this.route.snapshot.params['id'];
        this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => this.sweep = sweeps.getItem(sweepId));
    }

    changeIsFrequency(event: MatSlideToggleChange, panel: MatExpansionPanel) {
        this.sweep.is_frequency = event.checked;

        if (!event.checked) {
            panel.close();
        }
    }

    changeIsReferral(event: MatSlideToggleChange, panel: MatExpansionPanel) {
        this.sweep.is_referral = event.checked;

        if (!event.checked) {
            panel.close();
        }
    }

    openCalendar(picker, calInput) {
        picker.open();
        calInput.blur();
    }

    login(candidate: SocialMedia) {
        if (this.loggedSocialMedias.includes(candidate)) {
            return;
        }
        switch (candidate) {
            case SocialMedia.facebook:
                this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
                    this.usersService.login({ ...data, user_account_id: undefined, expiration_date: undefined, auth_error: undefined })
                        .subscribe(() => {
                            this.loggedSocialMedias.push(SocialMedia.facebook);
                        });
                });
                break;
            case SocialMedia.google:
                this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
                    this.usersService.login({ ...data, user_account_id: undefined, expiration_date: undefined, auth_error: undefined })
                        .subscribe(inner => {
                            this.loggedSocialMedias.push(SocialMedia.google);
                        });
                });
                break;
        }
    }

    back() {
        this.router.navigate(['./list']);
    }
}
