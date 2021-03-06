import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
//
import * as _ from 'lodash';
import { NgRedux } from '@angular-redux/store';
import { createLogger } from 'redux-logger';
import { compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
//
import { AppState, rootReducer, INITIAL_STATE } from './state/store';
import { BaseEpic } from './state/models/base-epic';
import { LoginEpics } from './state/login/login.epics';
import { SweepsEpics } from './state/sweeps/sweeps.epics';
import { LoginActions } from './state/login/login.actions';
import { LocalStorageKeys } from './models/local-storage-keys.enum';
import { SweepsActions } from './state/sweeps/sweeps.actions';
import { CommonActions } from './state/common/common.actions';

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

    constructor(iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer,
                private ngRedux: NgRedux<AppState>,
                private router: Router,
                private loginEpics: LoginEpics,
                private loginActions: LoginActions,
                private sweepsActions: SweepsActions,
                private commonActions: CommonActions,
                private sweepsEpics: SweepsEpics) {
        iconRegistry.addSvgIcon('calendar', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendar.svg'));
        iconRegistry.addSvgIcon('gift', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/gift.svg'));
        iconRegistry.addSvgIcon('win', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/win.svg'));
        iconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg'));
        iconRegistry.addSvgIcon('feedback', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/feedback.svg'));
        iconRegistry.addSvgIcon('power', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/power.svg'));
        iconRegistry.addSvgIcon('star', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/star.svg'));
        iconRegistry.addSvgIcon('win', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/win.svg'));
        iconRegistry.addSvgIcon('internet', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/internet.svg'));
    }

    ngOnInit() {
        this.router.events.subscribe(x => {
            if (x instanceof NavigationEnd) {
                this.commonActions.routeChanged(x.url);
            }
        });
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
            this.loginActions.login({ id, fromCache: true });
        }
    }
}
