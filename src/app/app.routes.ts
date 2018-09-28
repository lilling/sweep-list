import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SweepListComponent } from './sweep-list/sweep-list.component';
import { AuthGuard } from './services/auth-guard.service';
import { EditSweepComponent } from './edit-sweep/edit-sweep.component';
import { ContainerComponent } from './container/container.component';
import { ToDoComponent } from './to-do/to-do.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { WinsComponent } from './wins/wins.component';
import { PaymentsComponent } from './components/payments/payments.component';

export const appRoutes: Routes = [
    { path: 'forgotPassword/:id', component: ForgotPasswordComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: '',
        component: ContainerComponent,
        children: [
            { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
            { path: 'list', component: SweepListComponent, canActivate: [AuthGuard] },
            { path: 'todo/:mode',  component: ToDoComponent, canActivate: [AuthGuard]},
            { path: 'edit/:id', component: EditSweepComponent, canActivate: [AuthGuard] },
            { path: 'wins', component: WinsComponent, canActivate: [AuthGuard] },
            { path: 'payments', component: PaymentsComponent },
        ]
    }
];
