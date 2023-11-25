

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { apiService } from '../../shared/services/index';
@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    userDetails: any;
    accountDetails: any;
    profileForm: FormGroup;
    themeOptions: any = ['Theme1'];
    paymentMode: any = [true, false];
    enableForEmailNotificationonOrderOptions:any = [true, false];
    enableForSMSNotificationonOrderoptions:any = [true, false];
    enableForSMSNotificationonDispatchoptions:any = [true, false];
    enableForShippingChargesCollectOptions:any = [true, false];
    imageLogo:string;
    loading: boolean = false;
    constructor(private _apiService: apiService, public router: Router, public userservice: UserService, private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(localStorage.getItem('userId'));
        this.getUserDetails(localStorage.getItem('userId'));
        this.profileForm = this._fb.group({
            fullName: new FormControl(null),
            accountEmail: new FormControl(null),
            websiteURL: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            imageLogo: new FormControl(null),
            brandName: new FormControl(null),
            facebookUrl: new FormControl(null),
            instagramUrl: new FormControl(null),
            twitterUrl: new FormControl(null),
            themeOption: new FormControl(null, [Validators.required]),
            //Contacts details on website for customers
            phoneNumber: new FormControl(null),
            email: new FormControl(null),
            pinCode: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            state: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            storePhysicalAddress: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            gstNo: new FormControl(null),
            panNo: new FormControl(null),
            cin: new FormControl(null),
            payUMerchantKey: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            payUMerchantSalt: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            payUMerchantHeader: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            key_id: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            key_secret: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            googlePayNo: new FormControl(null),
            phonePayNo: new FormControl(null),
            paytmNo: new FormControl(null),
            whatsApp: new FormControl(null),
            enableForCOD: new FormControl(null, [Validators.required]),
            enableForOnlinePayment: new FormControl(null, [Validators.required]),
            onlinePaymentMethod: new FormControl(null, [Validators.required]),
            enableForEmailNotificationonOrder: new FormControl(null, [Validators.required]),
            enableForSMSNotificationonOrder: new FormControl(null, [Validators.required]),
            enableForSMSNotificationonDispatch: new FormControl(null, [Validators.required]),
            enableForShippingChargesCollect: new FormControl(null, [Validators.required]),
            orderTemplate: localStorage.getItem('userId') + "_order.html",
            aboutUs: new FormControl(null),
            headerColor: new FormControl(null)
        });
    }

    
    getUserDetails(id) {
        this.userservice.getUserSettingsById(id).subscribe((res: any) => {
            console.log('res63=', res);
            if (res['status'] != 200) {
                Swal({
                    title: 'Sorry !!',
                    text: res["data"],
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    this.router.navigate(["/layout/dashboard"]);
                });
            }
            else {
                console.log(', res0resres', res);
                if (res.storeGeneralInfo && res.paymentKeys) {
                    this.profileForm.patchValue(res.storeGeneralInfo);
                    this.profileForm.patchValue(res.paymentKeys);
                    this.profileForm.patchValue(res.userModelData);
                    this.imageLogo = res.storeGeneralInfo.imageLogo;
                    // this.accountDetails = res.userModelData;
                }
            }
        });
    }

    submitForm() {
        this._apiService.updateStoreProfile(Object.assign({ "userId": localStorage.getItem('userId') }, this.profileForm.value))
            .subscribe(res => {
                console.log('63', res )
                if (res["status"] == 200 || res["status"] == "200") {
                    if(this.myFiles.length > 0){
                        const file_data = new FormData();
                        for (var i = 0; i < this.myFiles.length; i++) {
                            console.log('68', this.myFiles[i]);
                            file_data.set("logoImage", this.myFiles[i]);
                        }
                        file_data.append("userId", localStorage.getItem('userId'));
                        this._apiService.updateStoreLogo(file_data)
                        .subscribe(res=>{
                            console.log('res', res);
                            if(res["status"] == 200 || res["status"] == "200"){
                                console.log('res 76', res);
                                Swal({
                                    title: 'Thank you',
                                    text: res["data"],
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'OK'
                                  }).then((result) => {
                                    this.router.navigate(["/layout/dashboard"]);
                                  });
                            }
                            else{
    
                            }
                        });
                    }else{
                        Swal({
                            title: 'Thank you',
                            text: res["data"],
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                          }).then((result) => {
                            this.router.navigate(["/layout/dashboard"]);
                          });
                    }
                    
                }
            });

    }

    myFiles: string[] = [];

    getFileDetails(e) {
      this.myFiles = [];
      //console.log (e.target.files);
      for (var i = 0; i < e.target.files.length; i++) {
        this.myFiles.push(e.target.files[i]);

      }
    }
}

