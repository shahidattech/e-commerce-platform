//import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { apiService } from '../../../shared/services/index';

import { SliderAddRoutingModule } from './slider-add-routing.module';
import { SliderAddComponent } from './slider-add.component';
import { PageHeaderModule } from '../../../shared';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { FileUploadModule } from '@iplab/ngx-file-upload';
@NgModule({
    imports: [CommonModule,NgSelectModule, FormsModule,ReactiveFormsModule, HttpClientModule, SliderAddRoutingModule, PageHeaderModule,FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),NgbModule],
    providers: [apiService],
    declarations: [SliderAddComponent, ],
    exports: []
    

})
export class SliderAddModule {}
