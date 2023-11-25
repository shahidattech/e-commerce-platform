import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { SlideShowComponent } from './slideShow/OD_slideShow.component';
import { GetSlideShowComponent } from './get-slide-show/get-slide-show.component';
import { ProductComponent } from './product/product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ReviewedProductListComponent } from './reviewed-product-list/reviewed-product-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { PendingOrderListComponent } from './pending-order-list/pending-order-list.component';
import { shippedOrderListComponent } from './shipped-order-list/shippedOrder-list.component';
import { SlideListComponent } from './slideList/slide-list.component';
import { HomeConfigComponent } from './homeConfig/home-config.component';
import { HomeConfigTheme2Component } from './homeConfigTheme2/home-config.component';
import { SliderAddComponent } from './slider/sliderAdd/slider-add.component';
import { SliderListComponent } from './slider/sliderList/slider-list.component';
import { SubscriptionGuard } from '../shared/subscription/subscription.guard';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import { OrderSearchByDateComponent } from './order-search-by-date/order-search-by-date.component';

const routes: Routes = [
    // { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
            { path: 'product', component: ProductComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'product-edit/:productId', component: ProductComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'product-list', component: ProductListComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'reviewed-product-list', component: ReviewedProductListComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'customer-list', component: CustomerListComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'slide-show', component: SlideShowComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'slide-list', component: SlideListComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'slide-show/:slideShowId', component: SlideShowComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'get-slide-show', component: GetSlideShowComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'slider', component: SliderAddComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'slider-list', component: SliderListComponent, canActivate: [AuthGuard, SubscriptionGuard] },

            { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule', canActivate: [AuthGuard] },
            { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule', canActivate: [AuthGuard] },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule', canActivate: [AuthGuard] },

            { path: 'home-config', component: HomeConfigComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'home-config-theme1', component: HomeConfigComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'home-config-theme2', component: HomeConfigTheme2Component, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'websiteorders', component: OrderListComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'websitependingorders', component: PendingOrderListComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'shippedorders', component: shippedOrderListComponent, canActivate: [AuthGuard, SubscriptionGuard] },
            { path: 'settings', loadChildren: './settings-page/settings-page.module#SettingsPageModule', canActivate: [AuthGuard] },
            { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard] },
            { path: 'payment-success', component: PaymentSuccessComponent },
            { path: 'payment-failed', component: PaymentFailedComponent },
            { path: 'order-search-by-date', component: OrderSearchByDateComponent, canActivate: [AuthGuard, SubscriptionGuard] },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
