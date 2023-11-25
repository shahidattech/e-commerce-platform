import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewedProductListRoutingModule } from './reviewed-product-list-routing.module';
import { ReviewedProductListComponent } from './reviewed-product-list.component';
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
    CommonModule,NgxSpinnerModule,DataTableModule,ReactiveFormsModule,FormsModule,ReviewedProductListRoutingModule,HttpModule,NgSelectModule,NgbModule.forRoot(),
  ],
  declarations: [ReviewedProductListComponent,DataFilterPipe],
  providers: [UserService,apiService],
  exports:[]
})
export class ReviewProductListModule { }
