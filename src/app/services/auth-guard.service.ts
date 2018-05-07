import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate() {
        const id = localStorage.getItem(LocalStorageKeys.loggedUser);
        if (id) {
            return true;
        } else {
            this.router.navigate(['/login']);
        }
        return false;
    }
}
