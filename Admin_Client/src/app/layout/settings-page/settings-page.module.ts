import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { SettingsPageComponent } from './settings-page.component';

@NgModule({
    imports: [CommonModule, SettingsPageRoutingModule, FormsModule,ReactiveFormsModule],
    declarations: [SettingsPageComponent]
})
export class SettingsPageModule {}
