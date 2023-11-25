import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from "@angular/router";
import { apiService } from '../../shared/services/index';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    // public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public data: any;
    public orderCount : any = 0;
    public customerCount : any = 0;
    public reviewsCount : any = 0;
    public productCount : any = 0;
    
    constructor(private router: Router, private apiService: apiService) {
        this.sliders.push(
            {
                imagePath: 'assets/images/slider_1.jpeg',
                label: 'Start selling in a Global Market',
                text:
                    'You are just few steps behind to become tomorrows Entrepreneur.'
            },
            {
                imagePath: 'assets/images/slider_2.jpeg',
                label: 'Automate your Business.',
                text: 'Let the platform handle your daily Operational activities, run your business with less man power.'
            },
            {
                imagePath: 'assets/images/slider_3.jpeg',
                label: 'Secured and powerful',
                text:
                    'Your website is hosted on world most powerful cloud infrastructure.'
            }
        );
        

        // this.alerts.push(
        //     {
        //         id: 1,
        //         type: 'success',
        //         message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        //         Voluptates est animi quibusdam praesentium quam, et perspiciatis,
        //         consectetur velit culpa molestias dignissimos
        //         voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        //     },
        //     {
        //         id: 2,
        //         type: 'warning',
        //         message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        //         Voluptates est animi quibusdam praesentium quam, et perspiciatis,
        //         consectetur velit culpa molestias dignissimos
        //         voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        //     }
        // );
    }

    ngOnInit() {
        this.apiService.getdashBoardDataBySellerID(localStorage.getItem('userId'))
        .subscribe((result)=>{
            console.log('result=', result);
            this.data = result;
            if(result && result["data"]["orderCount"]){
                this.orderCount = result["data"]["orderCount"];
            }
            if(result && result["data"]["customerCount"]){
                this.customerCount = result["data"]["customerCount"];
            }
            if(result && result["data"]["rnrCount"]){
                this.reviewsCount = result["data"]["rnrCount"];
            }
            if(result && result["productCount"]){
                this.productCount = result["data"]["productCount"];
            }

        });
    }

    productList(){
        this.router.navigate(["/layout/product-list"]);
    }

    orderList(){
        this.router.navigate(["/layout/websiteorders"]);
    }
    reviewList(){
        this.router.navigate(["/layout/reviewed-product-list"]);
    }
    customerList(){
        this.router.navigate(["/layout/customer-list"]);
    }

    // public closeAlert(alert: any) {
    //     const index: number = this.alerts.indexOf(alert);
    //     this.alerts.splice(index, 1);
    // }
}
