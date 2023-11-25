import { NgModule,forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
// import { RoleGuard  } from '../shared/guard/role-guard.service';
import { AuthGuard } from './shared';
// import { FileSelectDirective } from 'ng2-file-upload';
import { ReactiveFormsModule } from '@angular/forms';
import { ENgxFileUploadModule } from "e-ngx-fileupload";
import { CompareDirective } from './compare.directive';
import { AuthServiceService} from './shared/services/auth-service.service';
import { UserService} from './shared/services/user.service';
import { TokenInterceptor } from './shared/auth/auth-skil.interceptor'
import { SubscriptionGuard } from './shared/subscription/subscription.guard';

// import { ENgxFileUploadDirective } from './filinput.directive';
// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-angular/SB-Admin-BS4-Angular-6/master/dist/assets/i18n/',
        '.json'
    ); */
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        ENgxFileUploadModule,
        HttpModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule
    ],
    declarations: [AppComponent, CompareDirective],
    providers: [AuthServiceService,AuthGuard,SubscriptionGuard,UserService,{
        provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
    bootstrap: [AppComponent]
})
export class AppModule {}
