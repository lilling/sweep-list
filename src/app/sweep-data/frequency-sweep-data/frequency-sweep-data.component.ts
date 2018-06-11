import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-frequency-sweep-data',
    templateUrl: 'frequency-sweep-data.component.html',
    styleUrls: ['frequency-sweep-data.component.scss']
})
export class FrequencySweepDataComponent {

    private url: string;
    private days: number;

    @Input() disabled: boolean;

    @Input() get frequencyUrl() { return this.url; }
    set frequencyUrl(val: string) {
        this.url = val;
        this.frequencyUrlChange.emit(this.url);
    }
    @Input() get frequencyDays() { return this.days; }
    set frequencyDays(val: number) {
        this.days = val;
        this.frequencyDaysChange.emit(this.days);
    }

    @Output() frequencyUrlChange = new EventEmitter();
    @Output() frequencyDaysChange = new EventEmitter();
}
