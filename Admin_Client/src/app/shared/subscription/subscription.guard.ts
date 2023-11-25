import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let userId = localStorage.getItem('userId');
    // console.log("userId", userId);
    return this.http.get(`${environment.adminServerAddresss}subscription/check/` + userId)
      .pipe(map((response: any) => {
        // console.log(response);
        if (response && response.status == 'success' && response.isExpired == false) {
          return true;
        } else if (response && response.msg && response.msg_info && response.isExpired == true) {
          this.router.navigate(['/layout/dashboard']);
          Swal({
            title: response.msg,
            text: response.msg_info,
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Pay Now',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            // console.log(result);
            if (result.value) {
              // console.log("goto subscription page");
              this.router.navigate(['/layout/subscription']);
            }
          })
          return false;
        } else {
          this.router.navigate(['/layout/dashboard']);
          Swal({
            title: 'Subscription Expired',
            text: 'Please pay the subscription first',
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Pay Now',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            // console.log(result);
            if (result.value) {
              // console.log("goto subscription page");
              this.router.navigate(['/layout/subscription']);
            }
          })
          return false;
        }

      }), catchError((error) => {
        // console.log(error);
        this.router.navigate(['/layout/dashboard']);
        Swal({
          title: 'Server Error!!',
          text: 'Please try after sometime',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        }).then((result) => {
          // console.log(result);
          if (result.value) {
            this.router.navigate(['/layout/dashboard']);
          }
        });

        return of(false);
      }));

  }

}
