import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//
import { LocalStorageModule } from 'angular-2-local-storage';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
//
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { SweepListComponent } from './sweep-list/sweep-list.component';
import { appRoutes } from './app.routes';
import { AddSweepComponent } from './add-sweep/add-sweep.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './services/users.service';

const SOCIAL_CONFIG = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('1057083499190-heocpiamo4h8ie9vpungc7ae6qg0m2s9.apps.googleusercontent.com')
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1940493829534171')
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
        SweepListComponent
    ],
    imports: [
        RouterModule.forRoot(appRoutes),
        LocalStorageModule.withConfig({
            prefix: 'sweep-imp',
            storageType: 'localStorage'
        }),
        BrowserModule,
        HttpClientModule,
        MaterialModule,
        SocialLoginModule.initialize(SOCIAL_CONFIG),
        BrowserAnimationsModule
    ],
    providers: [UsersService],
    bootstrap: [AppComponent],
    exports: [RouterModule],
    entryComponents: [AddSweepComponent]
})
export class AppModule {
}
