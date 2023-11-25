import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { shippedOrderListComponent } from './shippedOrder-list.component';

const routes: Routes = [
    {
        path: '',
        component: shippedOrderListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class shippedOrderListRoutingModule {}
