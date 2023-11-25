import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './../shared/services/user.service';
// import { RoleGuard } from './../shared/guard/role-guard.service';
//import { AlertService } from './../shared/services/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private _myservice: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, Validators.email),
      passwd: new FormControl(null, Validators.required)
    });

  }

  ngOnInit() {
  }

  isValid(controlName) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  login(): void {
    // localStorage.setItem('user', 'user');
    // this._router.navigate(['/layout/dashboard']);

    console.log(this.loginForm.value);
    this.spinner.show();
    if (this.loginForm.valid) {
      this._myservice.login(this.loginForm.value)
        .subscribe(
          data => {
            console.log("data", data);
            this.spinner.hide();
            if (data.success && data.active) {
              localStorage.setItem('userInfo',JSON.stringify(data.user));
              localStorage.setItem('userId',data.user.userId);
              localStorage.setItem('userRole', data.user.userRole);
              console.log(data);
              //localStorage.setItem('token', data.toString());
              this._router.navigate(['/layout/dashboard']);
            } else if (data.success && data.active == false) {
              Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Your account is not Authenticated, Invalid Password'
              });
            } else {
              //return false;
              Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Email id is not register'
              });
              // alert('email id is not register');
            }

          },
          error => {
            this.spinner.hide();
          }
        );
    }
  }
}