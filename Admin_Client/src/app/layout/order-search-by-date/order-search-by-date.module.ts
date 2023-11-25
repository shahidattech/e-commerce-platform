import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListRoutingModule } from './order-search-by-date-routing.module';
import { OrderSearchByDateComponent, serviceAvailabilityComponent } from './order-search-by-date.component';
import { HttpModule } from '@angular/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/services/user.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { apiService } from '../../shared/services/index';
import { NgxSpinnerModule } from 'ngx-spinner';
import {DataTableModule} from "angular2-datatable";
import {DataFilterPipe} from "./data-filter.pipe";
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
 imports: [
    CommonModule,BrowserModule, NgxSpinnerModule,DataTableModule,ReactiveFormsModule,FormsModule,OrderListRoutingModule,HttpModule,NgSelectModule,NgbModule.forRoot(),
  ],
  declarations: [OrderSearchByDateComponent,DataFilterPipe, serviceAvailabilityComponent],
  providers: [UserService,apiService],
  exports:[],
  entryComponents:[serviceAvailabilityComponent]
})
export class OrderSearchByDateModule { }
