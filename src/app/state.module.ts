import { NgModule } from '@angular/core';
import { ErrorActions } from './state/common/errors/error.actions';
import { LoginActions } from './state/login/login.actions';
import { LoginEpics } from './state/login/login.epics';
import { SweepsActions } from './state/sweeps/sweeps.actions';
import { SweepsEpics } from './state/sweeps/sweeps.epics';

@NgModule({
    providers: [ErrorActions, LoginActions, LoginEpics, SweepsActions, SweepsEpics],
})
export class StateModule {
}
