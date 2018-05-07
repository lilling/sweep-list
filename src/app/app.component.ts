import { Component, OnInit } from '@angular/core';
//
import * as _ from 'lodash';
import { NgRedux } from '@angular-redux/store';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
//
import { AppState, rootReducer, INITIAL_STATE } from './state/store';
import { BaseEpic } from './state/models/base-epic';
import { compose } from 'redux';
import { LoginEpics } from './state/login/login.epics';
import { SweepsEpics } from './state/sweeps/sweeps.epics';
import { LoginActions } from './state/login/login.actions';
import { LocalStorageKeys } from './models/local-storage-keys.enum';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    private getEpics = (): any[] => {
        const epicClasses: BaseEpic[] = [
            this.loginEpics,
            this.sweepsEpics
        ];
        return _.flatten(epicClasses.map(epicClass => epicClass.getEpics()));
    }

    constructor(private ngRedux: NgRedux<AppState>,
                private loginEpics: LoginEpics,
                private loginActions: LoginActions,
                private sweepsEpics: SweepsEpics) {
    }

    ngOnInit() {
        const middlewares = [];
        const composeEnhancers =
            typeof window === 'object' &&
            window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
                // && this.config.getEnv('env') === 'development'
                ?
                window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
                    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
                }) : compose;
        const rootEpicMiddleware = combineEpics(...this.getEpics());
        const epicMiddleware = createEpicMiddleware(rootEpicMiddleware);
        const logger = createLogger();
        middlewares.push(logger);
        middlewares.push(epicMiddleware);

        const enhancer = composeEnhancers(
            // other store enhancers if any
        );
        this.ngRedux.configureStore( // reducer, initState, middleware, enhancers
            rootReducer,
            INITIAL_STATE,
            middlewares,
            enhancer
        );

        const id = localStorage.getItem(LocalStorageKeys.loggedUser);
        if (id) {
            this.loginActions.login({id, fromCache: true});
        }
    }
}
