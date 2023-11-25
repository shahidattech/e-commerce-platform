import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbCarouselModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserService } from './../shared/services/user.service';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpModule } from '@angular/http';
import { AuthGuard } from '../shared';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgDatepickerModule } from '../../ng-datepicker/module/ng-datepicker.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { SlideShowComponent } from './slideShow/OD_slideShow.component';
import { DataTableModule } from "angular2-datatable";
import { FileSelectDirective } from 'ng2-file-upload';
import { ENgxFileUploadDirective } from './../filinput.directive';
import { PageHeaderModule } from './../shared';
import { GetSlideShowComponent } from './get-slide-show/get-slide-show.component';
import { ProductComponent } from './product/product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ReviewedProductListComponent } from './reviewed-product-list/reviewed-product-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { OrderListComponent, ServiceAvailableModalComponent } from './order-list/order-list.component';
import { PendingOrderListComponent } from './pending-order-list/pending-order-list.component';
import { shippedOrderListComponent } from './shipped-order-list/shippedOrder-list.component';
import { DataFilterPipe } from './product-list/data-filter.pipe';
import { SlideListComponent } from './slideList/slide-list.component';
import { HomeConfigComponent } from './homeConfig/home-config.component';
import { DemoMaterialModule } from '../material-module';
import { EditInputComponent } from '../components/edit-input/edit-input.component';
import { AutofocusDirective } from '../autofocus.directive';
import { DemoPicturePipe } from './homeConfig/demo-picture.pipe';
import { HomeConfigTheme2Component } from './homeConfigTheme2/home-config.component';
import { SliderListComponent } from './slider/sliderList/slider-list.component';
import { SliderAddComponent } from './slider/sliderAdd/slider-add.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import { ngbdModalConfirmAutofocus } from './order-details/order-details.component';
import { OrderSearchByDateComponent } from './order-search-by-date/order-search-by-date.component';

@NgModule({
    imports: [
        CommonModule, HttpModule, DataTableModule,
        FormsModule, ReactiveFormsModule,
        LayoutRoutingModule, NgxSpinnerModule,
        TranslateModule,
        FroalaEditorModule, FroalaViewModule,
        NgbDropdownModule.forRoot(),
        NgSelectModule, NgDatepickerModule,
        NgSlimScrollModule,
        PageHeaderModule,
        NgbCarouselModule,
        NgbModule,
        DemoMaterialModule
    ],

    providers: [AuthGuard, UserService],
    declarations: [LayoutComponent,
        SlideShowComponent,
        SidebarComponent,
        HeaderComponent,
        FileSelectDirective,
        ENgxFileUploadDirective,
        GetSlideShowComponent,
        ProductComponent,
        DataFilterPipe,
        ProductListComponent,
        ReviewedProductListComponent,
        CustomerListComponent,
        OrderListComponent,
        PendingOrderListComponent,
        shippedOrderListComponent,
        SlideListComponent,
        HomeConfigComponent,
        HomeConfigTheme2Component,
        EditInputComponent,
        AutofocusDirective,
        DemoPicturePipe,
        SliderListComponent,
        SliderAddComponent,
        ServiceAvailableModalComponent,
        SubscriptionComponent,
        PaymentSuccessComponent,
        PaymentFailedComponent,
        ngbdModalConfirmAutofocus,
        OrderSearchByDateComponent
    ],
    entryComponents: [
        ServiceAvailableModalComponent, ngbdModalConfirmAutofocus
    ]
})
export class LayoutModule { }
