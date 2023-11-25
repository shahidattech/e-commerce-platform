import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from './user';
import { UserService } from '../../../shared/services/user.service';
declare var jquery:any;
declare var $ :any;
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    constructor(private translate: TranslateService, public router: Router) {    
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
        // this.user = JSON.parse(localStorage.getItem('user'));
    }

    ngOnInit() {
      // var userName localStorage.setItem('user', data.user.firstName);
     var userName = localStorage.getItem('user');
     console.log(userName);
      if (userName) {
        document.getElementById('dataName').innerHTML = "Hello " + userName + "!";
      } else
        document.getElementById('dataName').innerHTML = "Hello!";
      
   //    this.userService.save_token().subscribe((data: any) => {
   // //   this.userClaims = data;
   //    console.log(data)

   //  });
    }


    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }
    // onEdit(item){
    //   this._router.navigateByUrl(`/layout/account-update/${item._id}`)
    // }
    onLoggedout() {
     localStorage.removeItem('token');
     this.router.navigate(['/login']);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
