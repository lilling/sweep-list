import { Component, OnInit } from '@angular/core';
//
import { UsersService } from '../services/users.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';

@Component({
    selector: 'app-delete-account',
    templateUrl: 'delete-account.component.html',
    styleUrls: ['delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

    userId: number;

    constructor(private userService: UsersService,) {
        this.userId = +localStorage.getItem(LocalStorageKeys.loggedUser);
    }

    ngOnInit() {
        this.userService.getDeleteAccountData(this.userId).subscribe(data => {
            console.log(data);
        });
    }
}
