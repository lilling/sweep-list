import { NgModule } from '@angular/core';
import {MatGridListModule, MatButtonModule, MatCheckboxModule } from '@angular/material';

@NgModule({
    imports: [MatGridListModule, MatButtonModule, MatCheckboxModule],
    exports: [MatGridListModule, MatButtonModule, MatCheckboxModule],
})
export class MaterialModule {
}
