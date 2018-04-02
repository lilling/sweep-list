import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
    selector: '[appPositive]',
    providers: [{provide: NG_VALIDATORS, useExisting: PositiveValidatorDirective, multi: true}]
})
export class PositiveValidatorDirective implements Validator {
    validate(control: AbstractControl): {[key: string]: any} {
        return { 'positive' : control.value < 0 };
    }
}