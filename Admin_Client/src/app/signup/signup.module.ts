import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './../shared/services/user.service';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,ReactiveFormsModule,FormsModule,
    SignupRoutingModule,NgxSpinnerModule
  ],
  providers: [UserService],
  declarations: [SignupComponent]
})
export class SignupModule { }
