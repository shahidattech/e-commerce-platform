import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListRoutingModule } from './order-list-routing.module';
import { OrderListComponent, serviceAvailabilityComponent } from './order-list.component';
import { HttpModule } from '@angular/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/services/user.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { apiService } from '../../shared/services/index';
import { NgxSpinnerModule } from 'ngx-spinner';
import {DataTableModule} from "angular2-datatable";
import {DataFilterPipe} from "./data-filter.pipe";

@NgModule({
 imports: [
    CommonModule,NgxSpinnerModule,DataTableModule,ReactiveFormsModule,FormsModule,OrderListRoutingModule,HttpModule,NgSelectModule,NgbModule.forRoot(),
  ],
  declarations: [OrderListComponent,DataFilterPipe, serviceAvailabilityComponent],
  providers: [UserService,apiService],
  exports:[],
  entryComponents:[serviceAvailabilityComponent]
})
export class OrderListModule { }
