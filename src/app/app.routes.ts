import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SweepListComponent } from './sweep-list/sweep-list.component';
import { AuthGuard } from './services/auth-guard.service';
import { EditSweepComponent } from './edit-sweep/edit-sweep.component';
import { ToDoComponent } from './to-do/to-do.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'list',  component: SweepListComponent, canActivate: [AuthGuard]},
    { path: 'todo',  component: ToDoComponent, canActivate: [AuthGuard]},
    { path: 'edit/:id', component: EditSweepComponent, canActivate: [AuthGuard]},
    { path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
