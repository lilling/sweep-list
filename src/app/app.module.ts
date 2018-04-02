import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//
import { LocalStorageModule } from 'angular-2-local-storage';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
//
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LoginOpt } from 'angularx-social-login';
import { SweepListComponent } from './sweep-list/sweep-list.component';
import { appRoutes } from './app.routes';
import { AddSweepComponent } from './add-sweep/add-sweep.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './services/users.service';
import { SweepsService } from './services/sweeps.service';
import { PositiveValidatorDirective } from './add-sweep/positive.validator';

const fbLoginOptions: LoginOpt = {
    scope: 'public_profile , email, publish_actions',
    return_scopes: true,
    enable_profile_selector: true
  }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

const SOCIAL_CONFIG = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('1057083499190-heocpiamo4h8ie9vpungc7ae6qg0m2s9.apps.googleusercontent.com')
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1940493829534171', fbLoginOptions)
    },
    // {
    //     id: LinkedinLoginProvider.PROVIDER_ID,
    //     provider: new LinkedinLoginProvider('LINKEDIN_CLIENT_ID')
    // }
]);

@NgModule({
    declarations: [
        AddSweepComponent,
        AppComponent,
        LoginComponent,
        SweepListComponent,
        PositiveValidatorDirective
    ],
    imports: [
        RouterModule.forRoot(appRoutes),
        LocalStorageModule.withConfig({
            prefix: 'sweep-imp',
            storageType: 'localStorage'
        }),
        BrowserModule,
        HttpClientModule,
        FormsModule,
        MaterialModule,
        SocialLoginModule.initialize(SOCIAL_CONFIG),
        AngularDateTimePickerModule,
        BrowserAnimationsModule
    ],
    providers: [UsersService, SweepsService],
    bootstrap: [AppComponent],
    exports: [RouterModule],
    entryComponents: [AddSweepComponent]
})
export class AppModule {
}
