import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewedProductListComponent } from './reviewed-product-list.component';

const routes: Routes = [
    {
        path: '',
        component: ReviewedProductListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReviewedProductListRoutingModule {}
