import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SweepListComponent } from './sweep-list/sweep-list.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'list',  component: SweepListComponent },
    { path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
