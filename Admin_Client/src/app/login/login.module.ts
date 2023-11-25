import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { UserService } from './../shared/services/user.service';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { AlertService } from './../shared/services/alert.service';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
    imports: [CommonModule,HttpModule, NgxSpinnerModule,LoginRoutingModule,ReactiveFormsModule,FormsModule],
    declarations: [LoginComponent],
    providers: [UserService]
})
export class LoginModule {}
