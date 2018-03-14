import { NgModule } from '@angular/core';
import {
    MatGridListModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule
} from '@angular/material';

@NgModule({
    imports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatInputModule, MatButtonToggleModule, MatDialogModule],
    exports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatInputModule, MatButtonToggleModule, MatDialogModule],
})
export class MaterialModule {
}
