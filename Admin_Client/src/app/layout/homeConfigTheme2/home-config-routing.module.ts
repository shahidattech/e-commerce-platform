import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeConfigTheme2Component } from './home-config.component';

const routes: Routes = [
    {
        path: '',
        component: HomeConfigTheme2Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeConfigTheme2RoutingModule {}
