import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderSearchByDateComponent } from './order-search-by-date.component';

const routes: Routes = [
    {
        path: '',
        component: OrderSearchByDateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderListRoutingModule {}
