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
    MatNativeDateModule
} from '@angular/material';

@NgModule({
    imports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatButtonToggleModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule],
    exports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatButtonToggleModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule]
})
export class MaterialModule {
}
