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
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
} from '@angular/material';

@NgModule({
    imports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatButtonToggleModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
        MatSlideToggleModule],
    exports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatButtonToggleModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
        MatSlideToggleModule]
})
export class MaterialModule {
}
