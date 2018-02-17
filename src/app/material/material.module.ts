import { NgModule } from '@angular/core';
import { MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule } from '@angular/material';

@NgModule({
    imports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule],
    exports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule],
})
export class MaterialModule {
}
