import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeConfigTheme2RoutingModule } from './home-config-routing.module';
import { HomeConfigTheme2Component } from './home-config.component';
import { HttpModule } from '@angular/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/services/user.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { apiService } from '../../shared/services/index';
import { NgxSpinnerModule } from 'ngx-spinner';
import {DataTableModule} from "angular2-datatable";
import { DemoPicturePipe } from './demo-picture.pipe';

@NgModule({
 imports: [
    CommonModule,NgxSpinnerModule,DataTableModule,ReactiveFormsModule,FormsModule,HomeConfigTheme2RoutingModule,HttpModule,NgSelectModule,NgbModule.forRoot(),
  ],
  declarations: [HomeConfigTheme2Component, DemoPicturePipe],
  providers: [UserService,apiService],
  exports:[]
})
export class HomeConfigTheme2Module { }
