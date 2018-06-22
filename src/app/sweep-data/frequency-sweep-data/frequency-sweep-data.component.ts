import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-frequency-sweep-data',
    templateUrl: 'frequency-sweep-data.component.html',
    styleUrls: ['frequency-sweep-data.component.scss']
})
export class FrequencySweepDataComponent {

    private days: number;
    @Output() isValidChange = new EventEmitter<boolean>();
    @Input() disabled: boolean;

    @Input() get frequencyDays() { return this.days; }
    set frequencyDays(val: number) {
        this.days = val;
        this.changeIsValid();
        this.frequencyDaysChange.emit(this.days);
    }

    @Output() frequencyDaysChange = new EventEmitter();

    private changeIsValid() {
        this.isValidChange.emit(this.days > 0);
    }
}
