import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeConfigComponent } from './home-config.component';

const routes: Routes = [
    {
        path: '',
        component: HomeConfigComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeConfigRoutingModule {}
