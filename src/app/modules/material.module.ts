import { NgModule } from '@angular/core';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule} from '@angular/material/button';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule} from '@angular/material/icon';
import { MatListModule} from '@angular/material/list';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatInputModule} from '@angular/material/input';
import { MatMenuModule} from '@angular/material/menu';
import { MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatRadioModule} from '@angular/material/radio';
import { MatTabsModule} from '@angular/material/tabs';

@NgModule({
    imports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatButtonToggleModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
        MatSlideToggleModule, MatExpansionModule, MatRadioModule, MatTabsModule],
    exports: [MatGridListModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatSidenavModule, MatMenuModule,
        MatButtonToggleModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
        MatSlideToggleModule, MatExpansionModule, MatRadioModule, MatTabsModule]
})
export class MaterialModule {
}
