import { NgModule } from '@angular/core';
import { ErrorActions } from './state/common/errors/error.actions';
import { LoginActions } from './state/login/login.actions';
import { LoginEpics } from './state/login/login.epics';

@NgModule({
    providers: [ErrorActions, LoginActions, LoginEpics],
})
export class StateModule {
}
