import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-win-sweep-data',
    templateUrl: 'win-sweep-data.component.html',
    styleUrls: ['win-sweep-data.component.scss']
})
export class WinSweepDataComponent {

    private days: number;
    private prize: string;
    private won: number;
    @Output() isValidChange = new EventEmitter<boolean>();
    
    @Input() get prizeValue() { return this.prize; }
    set prizeValue(val: string) {
        this.prize = val;
        this.changeIsValid();
        this.prizeValueChange.emit(this.prize);
    }

    @Input() get wonYN() { return this.won; }
    set wonYN(val: number) {
        this.won = val;
        this.changeIsValid();
        this.wonYNChange.emit(this.won);
    }

    @Input() get frequencyDays() { return this.days; }
    set frequencyDays(val: number) {
        this.days = val;
        this.changeIsValid();
        this.frequencyDaysChange.emit(this.days);
    }

    @Output() frequencyDaysChange = new EventEmitter();
    @Output() prizeValueChange = new EventEmitter();
    @Output() wonYNChange = new EventEmitter();

    isPrizeInvalid(val) {
        return isNaN(Number(val)) || val < 0;
    }

    private changeIsValid() {
        this.isValidChange.emit(!this.isPrizeInvalid(this.prize));
    }
}
