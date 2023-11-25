import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingOrderListComponent } from './pending-order-list.component';

const routes: Routes = [
    {
        path: '',
        component: PendingOrderListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderListRoutingModule {}
