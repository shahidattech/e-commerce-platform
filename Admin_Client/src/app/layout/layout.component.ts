import { Component, OnInit  } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    
    collapedSideBar: boolean;

    constructor(private router: Router,private spinner: NgxSpinnerService) {}

    ngOnInit() {}

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
     ngAfterViewInit() {
        this.router.events
            .subscribe((event) => {
                if(event instanceof NavigationStart) {
                   this.spinner.show();
                }
                else if (
                    event instanceof NavigationEnd || 
                    event instanceof NavigationCancel
                    ) {
                  this.spinner.hide();
                }
            });
    }
}
