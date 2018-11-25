import { NgModule } from '@angular/core';
import { MatProgressBarModule, MatCardModule, MatButtonModule } from '@angular/material';

@NgModule({
    imports: [MatProgressBarModule, MatCardModule, MatButtonModule],
    exports: [MatProgressBarModule, MatCardModule, MatButtonModule]
})
export class MaterialModule { }
