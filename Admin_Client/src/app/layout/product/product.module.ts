import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { apiService } from '../../shared/services/index';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { PageHeaderModule } from './../../shared';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FileSelectDirective } from 'ng2-file-upload';
import { ENgxFileUploadDirective } from '../../filinput.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../bs-component/components';
// import { FileUploadModule } from '@iplab/ngx-file-upload';
@NgModule({
    imports: [CommonModule,NgSelectModule, FormsModule,ReactiveFormsModule, HttpClientModule, ProductRoutingModule, PageHeaderModule,FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),NgbModule],
    providers: [apiService],
    declarations: [ProductComponent,ENgxFileUploadDirective, FileSelectDirective, ModalComponent],
    exports: [ENgxFileUploadDirective]
    

})
export class ProductModule {}
