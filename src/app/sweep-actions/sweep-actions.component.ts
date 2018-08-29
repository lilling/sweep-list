import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { user_account, user_sweep } from '../../../shared/classes';

@Component({
  selector: 'app-sweep-actions',
  templateUrl: 'sweep-actions.component.html',
  styleUrls: ['sweep-actions.component.scss']
})
export class SweepActionsComponent implements OnInit {

    @Input() user: user_account;
    @Input() sweep: user_sweep;
    @Output() sweepEntered = new EventEmitter();

    constructor() { }

    openUrl(urlToOpen: string) {
        this.sweepEntered.emit();
        let url = '';
        if (!/^http[s]?:\/\//.test(urlToOpen)) {
            url += 'http://';
        }

        url += urlToOpen;
        window.open(url, '_blank');
    }


    ngOnInit() {
  }

}
