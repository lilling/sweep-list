import { OnDestroy } from '@angular/core';
//
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

export class Subscriber implements OnDestroy {
    protected subscriptions: {[index: string]: Subscription};

    ngOnDestroy(): void {
        _.forOwn(this.subscriptions, subscription => subscription.unsubscribe());
    }
}
