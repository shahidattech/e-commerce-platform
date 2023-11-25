import { Component, OnInit } from '@angular/core';
import { apiService } from 'src/app/shared/services';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  subscriptionContent: any = {
    plans: [],
    heading: {
      title: '',
      short_title: ''
    }
  };
  mySubscription: any;
  constructor(private api: apiService, private router: Router) { }

  ngOnInit() {
    this.getSubscriptionContent();
  }

  getSubscriptionContent() {
    let req_data = Object.assign({ "userId": localStorage.getItem('userId') });
    this.api.getSubscriptionContent(req_data).subscribe((res: any) => {
      console.log(res);
      if (res && res.status) {
        this.subscriptionContent = res.data;
        this.getMySubscriptionDetails();
      }
    }, err => {
      console.log(err);
    })
  }

  getMySubscriptionDetails() {
    let userID = localStorage.getItem('userId');
    this.api.checkSubscription(userID).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.mySubscription = res;
      }
    }, err => {
      console.log(err);
    })
  }

  payNow(p) {
    console.log(p);
    let userInfo: any = JSON.parse(localStorage.getItem('userInfo'));
    let userId = localStorage.getItem('userId');
    console.log(userInfo);
    if(localStorage.getItem('userInfo') == null){
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
    
    Swal({
      title: "Enter you mobile number",
      inputPlaceholder: "10 digit mobile number",
      input: 'tel',
      showCancelButton: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        console.log("Result: " + result.value);
        if (!result.value.match('[0-9]{10}')) {
          Swal("Enter 10 digit mobile number!", "", "error");
          return;
        } else {
          let extra = {
            email: userInfo.userName,
            phone: result.value,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            // surl: 'https://api.dynamicexecution.com/api/v1/subscription/subscriptionrechargesuccess',
            // furl: 'https://api.dynamicexecution.com/api/v1/subscription/subscriptionrechargefailure'
            surl: environment.adminServerAddresss + 'subscription/subscriptionrechargesuccess',
            furl: environment.adminServerAddresss + 'subscription/subscriptionrechargefailure'
          }
          let req_data = Object.assign({ "userId": userId, 'planDetails': p }, extra);
          console.log(req_data);
          // return;

          this.api.paySubscription(req_data).subscribe((res: any) => {
            console.log(res);
            if (res && res.status == 'SUCCESS') {
              window.location.href = res.data;
            } else {
              Swal({
                title: 'Server Error!!',
                text: 'Please try after sometime',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              });
            }
          })
        }
      } else {
        Swal("Enter 10 digit mobile number!", "", "error");
      }
    })

  }

}
