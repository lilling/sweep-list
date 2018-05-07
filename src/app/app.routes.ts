import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SweepListComponent } from './sweep-list/sweep-list.component';
import { AuthGuard } from './services/auth-guard.service';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'list',  component: SweepListComponent, canActivate: [AuthGuard]},
    { path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
