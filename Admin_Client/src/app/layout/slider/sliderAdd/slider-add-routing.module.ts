import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SliderAddComponent } from './slider-add.component';

const routes: Routes = [
    {
        path: '', component: SliderAddComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SliderAddRoutingModule {
}
