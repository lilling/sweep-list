import { Component, OnInit, OnDestroy } from '@angular/core';
//
import { Subscription } from 'rxjs/Subscription';
//
import { UsersService } from '../services/users.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { MatDialogRef } from '@angular/material';
import { LoginActions } from '../state/login/login.actions';
import { NgRedux } from '@angular-redux/store';
import { AppState, INITIAL_STATE } from '../state/store';

@Component({
    selector: 'app-delete-account',
    templateUrl: 'delete-account.component.html',
    styleUrls: ['delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit, OnDestroy {

    userId: AAGUID;
    data: { tasks: string, active: string, ended: string, won: string };
    subscription: Subscription;

    constructor(public dialogRef: MatDialogRef<DeleteAccountComponent>,
                public ngRedux: NgRedux<AppState>,
                public loginActions: LoginActions,
                private userService: UsersService) {
        this.userId = localStorage.getItem(LocalStorageKeys.loggedUser);
    }

    ngOnInit() {
        this.subscription = this.userService.getDeleteAccountData(this.userId).subscribe(data => {
            this.data = data;
        });

        this.ngRedux.select(state => state).subscribe(state => {
            if (state.loginState.user === null) {
                this.dialogRef.close();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
