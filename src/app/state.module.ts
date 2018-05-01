import { NgModule } from '@angular/core';
import { ErrorActions } from './state/common/errors/error.actions';

@NgModule({
    providers: [ErrorActions],
})
export class StateModule {
}
