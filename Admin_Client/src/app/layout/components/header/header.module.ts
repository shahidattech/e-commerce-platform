import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HeaderComponent } from './header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,HttpClient,HttpClientModule,HttpModule
  ],
  declarations: [HeaderComponent],
  providers:[]
})
export class HeaderModule { }
