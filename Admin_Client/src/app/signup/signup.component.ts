import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from './../shared/services/user.service';
import { compareValidator } from '../compare.directive';
import { phoneNumberValidator } from '../compare.directive';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private _router: Router, private _userService: UserService, private spinner: NgxSpinnerService, private _fb: FormBuilder) { }
  ngOnInit() {
    this.registerForm = this._fb.group({
      userName: [null, [Validators.required, Validators.email]],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      fullName: [null, [Validators.required, Validators.minLength(3)]],
      phoneNo: [null, [Validators.required, Validators.minLength(10), phoneNumberValidator]],
      passwd: [null, [Validators.required, Validators.minLength(6)]],
      // userRole: [null, [Validators.required]],
      // active:[null],
      passwd2: [null, [Validators.required, Validators.minLength(6), compareValidator('passwd')]],
    });
  }
  get userName() {
    return this.registerForm.get('userName');
  }
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get fullName() {
    return this.registerForm.get('fullName');
  }
  //  get userRole() {
  //    return this.registerForm.get('userRole');
  //  }
  get phoneNo() {
    return this.registerForm.get('phoneNo');
  }
  //  get active() {
  //    return this.registerForm.get('active');
  //  }
  get passwd() {
    return this.registerForm.get('passwd');
  }
  get passwd2() {
    return this.registerForm.get('passwd2');
  }
  moveToLogin() {
    this._router.navigate(['/login']);
  }
  register() {
    console.log("this.registerForm.value", this.registerForm.value);
    this.spinner.show();
    this._userService.register(JSON.stringify(this.registerForm.value))
      .subscribe(
        data => {
          this.spinner.hide();
          console.log("data", data);
          Swal({
            title: 'Thank you for signup',
            text: "Click ok button going for login page",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            console.log(result);
            if (result.value) {
              this._router.navigate(['/login'])
            }
          })
        },
        error => {
          console.log('error', error)
          Swal({
            title: 'Email Id is already exist',
            text: "If you want to login then click ok button. Otherwise click cancel button",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
            // showCancelButton: true
          }).then((result) => {
            if (result.value) {
              this._router.navigate(['/login']);
            }
          });
          this.spinner.hide();
        });
  }
}