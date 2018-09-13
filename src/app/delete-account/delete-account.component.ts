import { Component, OnInit } from '@angular/core';
//
import { UsersService } from '../services/users.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { MatDialogRef } from '@angular/material';
import { LoginActions } from '../state/login/login.actions';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../state/store';
import { Subscriber } from '../classes/subscriber';

@Component({
    selector: 'app-delete-account',
    templateUrl: 'delete-account.component.html',
    styleUrls: ['delete-account.component.scss']
})
export class DeleteAccountComponent extends Subscriber implements OnInit {

    userId: AAGUID;
    data: { tasks: string, active: string, ended: string, won: string };

    constructor(public dialogRef: MatDialogRef<DeleteAccountComponent>,
                public ngRedux: NgRedux<AppState>,
                public loginActions: LoginActions,
                private userService: UsersService) {
        super();
        this.userId = localStorage.getItem(LocalStorageKeys.loggedUser);
    }

    ngOnInit() {
        this.subscriptions = {
            deleteData: this.userService.getDeleteAccountData(this.userId).subscribe(data => this.data = data)
        };

        this.ngRedux.select(state => state).subscribe(state => {
            if (state.loginState.user === null) {
                this.dialogRef.close();
            }
        });
    }
}
