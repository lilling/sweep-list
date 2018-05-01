import { Injectable } from '@angular/core';
//
import { BaseEpic } from '../models/base-epic';

@Injectable()
export class CommonEpics extends BaseEpic {

    constructor() {
        super();
    }
}
