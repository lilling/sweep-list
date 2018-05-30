import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-basic-sweep-data',
    templateUrl: 'basic-sweep-data.component.html',
    styleUrls: ['basic-sweep-data.component.scss']
})
export class BasicSweepDataComponent {

    private name: string;
    private endDate: Date;

    @Input() get sweepName() { return this.name; }
    set sweepName(val: string) {
        this.name = val;
        this.sweepNameChange.emit(this.name);
    }
    @Input() get sweepEndDate() { return this.endDate; }
    set sweepEndDate(val: Date) {
        this.endDate = val;
        this.sweepEndDateChange.emit(this.endDate);
    }

    @Output() sweepNameChange = new EventEmitter();
    @Output() sweepEndDateChange = new EventEmitter();
}
