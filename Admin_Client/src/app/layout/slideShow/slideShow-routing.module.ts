import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlideShowComponent } from './OD_slideShow.component';

const routes: Routes = [
    {
        path: '', component: SlideShowComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SlideShowRoutingModule {
}
