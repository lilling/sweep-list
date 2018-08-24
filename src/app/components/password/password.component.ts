import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-password',
    templateUrl: 'password.component.html',
    styleUrls: ['password.component.scss']
})
export class PasswordComponent {
    _password: string;
    showPassword: boolean;

    @ViewChild('passwordInput')
    private elPassword : ElementRef;

    @Input() get password() { return this._password; }
    set password(val: string) {
        this._password = val;
        
        this.passwordChange.emit(this._password);
    }

    @Output() passwordChange = new EventEmitter();

    togglePassword() {
        this.showPassword = !this.showPassword;
        this.elPassword.nativeElement.focus();
    }
}