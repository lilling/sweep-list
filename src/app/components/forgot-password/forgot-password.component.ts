import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    passwordChanged: boolean;
    inProcess = false;
    constructor(private router: Router, private route: ActivatedRoute, private userService: UsersService) {
    }

    changePassword(password: string) {
        this.inProcess = true;
        this.userService.changePassword(this.route.snapshot.params.id, password).subscribe(() => {
            this.passwordChanged = true;
            this.inProcess = false;
        });
    }
}
