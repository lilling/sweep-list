import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-basic-sweep-data',
    templateUrl: 'basic-sweep-data.component.html',
    styleUrls: ['basic-sweep-data.component.scss']
})
export class BasicSweepDataComponent {

    private name: string;
    private endDate: Date;
    private _url: string;

    @Output() isValidChange = new EventEmitter<boolean>();
    now = new Date();

    @Input() get sweepName() { return this.name; }
    set sweepName(val: string) {
        this.name = val;
        this.changeIsValid();
        this.sweepNameChange.emit(this.name);
    }
    @Input() get sweepEndDate() { return this.endDate; }
    set sweepEndDate(val: Date) {
        this.endDate = val;
        this.changeIsValid();
        this.sweepEndDateChange.emit(this.endDate);
    }

    @Input() get sweepUrl() { return this._url; }
    set sweepUrl(val: string) {
        this._url = val;
        this.changeIsValid();
        this.sweepUrlChange.emit(this._url);
    }

    @Output() sweepNameChange = new EventEmitter();
    @Output() sweepEndDateChange = new EventEmitter();
    @Output() sweepUrlChange = new EventEmitter();

    private changeIsValid() {
        this.isValidChange.emit(!!this.name && !!this.sweepUrl && !!this.endDate);
    }
}

