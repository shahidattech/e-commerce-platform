

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { apiService } from '../../shared/services/index';
@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    userDetails: any;
    profileForm: FormGroup;
    themeOptions: any = ['Theme1', 'Theme2'];
    loading: boolean = false;
    constructor(private _apiService: apiService, public router: Router, public userservice: UserService, private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(localStorage.getItem('userId'));
        this.getUserDetails(localStorage.getItem('userId'));
        this.profileForm = this._fb.group({
            fullName: new FormControl(null),
            accountEmail: new FormControl(null),
            websiteUrl: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            imageLogo: new FormControl(null),
            brandName: new FormControl(null),
            facebookUrl: new FormControl(null),
            instagramUrl: new FormControl(null),
            twitterUrl: new FormControl(null),
            themeOption: new FormControl(null, [Validators.required]),
            //Contacts details on website for customers
            phoneNumber: new FormControl(null),
            email: new FormControl(null),
            storePhysicalAddress: new FormControl(null),
            gstNo: new FormControl(null),
            panNo: new FormControl(null),
            cin: new FormControl(null),
            payUMerchantKey: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            payUMerchantSalt: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            payUMerchantHeader: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            whatsApp: new FormControl(null)
        });
    }

    getUserDetails(id) {
        this.userservice.getUserById(id).subscribe(res => {
            if (res) {

                this.userDetails = res;
                console.log('this.userDetails', this.userDetails);
            } else {
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
            }
        })
    }

    submitForm() {
        this._apiService.updateStoreProfile(Object.assign({ "userId": localStorage.getItem('userId') }, this.profileForm.value))
            .subscribe(res => {
                console.log('63', res )
                if (res["status"] == 200 || res["status"] == "200") {
                    const file_data = new FormData();
                    for (var i = 0; i < this.myFiles.length; i++) {
                        console.log('68', this.myFiles[i]);
                        file_data.set("logoImage", this.myFiles[i]);
                    }
                    file_data.append("userId", localStorage.getItem('userId'));
                    this._apiService.updateStoreLogo(file_data)
                    .subscribe(res=>{
                        console.log('res', res);
                        // if(res["sattus"] == 200){
                        //     Swal({
                        //         title: 'Thank you',
                        //         text: "Product created successfully. Click ok button to redirect products listing page",
                        //         type: 'success',
                        //         showCancelButton: false,
                        //         confirmButtonColor: '#3085d6',
                        //         confirmButtonText: 'OK'
                        //       }).then((result) => {

                        //       });
                        // }
                        // else{

                        // }
                    });
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

