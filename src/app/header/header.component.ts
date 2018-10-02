import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { NgRedux } from '@angular-redux/store';
//
import { CommonActions } from '../state/common/common.actions';
import { AppState } from '../state/store';
import { SweepsMode } from '../state/sweeps/sweeps.state';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent {
    @Input() title: string;
    @Input() showBackButton = false;
    @Input() showSearch = true;
    @Input() mode: SweepsMode;

    openSearch: boolean;
    searchText: string;

    constructor(private ngRedux: NgRedux<AppState>,
                private router: Router,
                private route: ActivatedRoute,
                private commonActions: CommonActions) {
        this.searchText = route.snapshot.params.searchString;
    }

    sendMail() {
        window.location.href = 'mailto:support@sweepimp.com';
    }

    search(nameSearch: string, isEnterKeyPressed: boolean) {
        if (isEnterKeyPressed) {
            this.router.navigate(['search', nameSearch, this.mode]);
        }
    }

    backClicked() {
        if (this.mode === SweepsMode.active) {
            this.router.navigate(['list']);
        } else {
            this.router.navigate(['todo', this.mode]);
        }
    }
}
