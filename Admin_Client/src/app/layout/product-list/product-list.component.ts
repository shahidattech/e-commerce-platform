import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { first } from 'rxjs/operators';
// import { User } from './user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { article, apiService } from '../../shared/services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject, Observable, of, concat } from 'rxjs';
import { Http } from "@angular/http";
declare var jquery: any;
import Swal from 'sweetalert2';
declare var $: any;
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { title } from 'process';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  users: any;
  user_activate: FormGroup;
  role_all
  //  = [
  //     { role: 'Author'},
  //     { role: 'Publisher'}
  //  ]; 
  userName: "";
  public data: any[];
  public filterQuery = "";
  public rowsOnPage = 5;
  public sortBy = "userName";
  public sortOrder = "asc";
  constructor(private http: Http, private router: Router, private userservice: UserService, private userService: UserService, private apiService: apiService, private modalService: NgbModal, private _formBuilder: FormBuilder, private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    this.getAllProducts();
    this.user_activate = this._formBuilder.group({
      active: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      userId: [''],
      filter: [''],
      articles: ['']
    });
    this.getHomeConfig();
    this.getUserDetails(localStorage.getItem('userId'));
  }

  websiteURL: any;
  getUserDetails(id) {
    this.userservice.getUserSettingsById(id).subscribe((res: any) => {
      console.log(res);
      if(res && res.userModelData && res.userModelData.websiteURL){
        this.websiteURL = res.userModelData.websiteURL;
      }
    });

  }

  // Get data from service
  private getAllProducts() {
    console.log('Getting all products again');
    let req_data = Object.assign({ "userId": localStorage.getItem('userId'), "page": 1 });
    this.apiService.getProducts(req_data)
      .subscribe((result) => {

        if(result['status'] == 200){
          this.data = result['data']['docs'][0]['products'];
          console.log(this.data);
        }
        else if( result['status'] == 204){
          Swal({
            title: 'Sorry !! ',
            text: "You have product created yet in your product inventory, Proceed to create your first product",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            this.router.navigate(["/layout/product-list"]);
          });
        }
        else{
          Swal({
            title: 'Sorry !!',
            text: "We are facing some technical issue right now, Please try later",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            this.router.navigate(["/layout/product-list"]);
          });
        }
      });
  }

  //Get Roles Lit

  public toInt(num: string) {
    return +num;
  }


  addAritcle(data) {
    console.log(this.user_activate.get('articles').value);
  }

  deleteItem(item) {
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
      //closeOnConfirm: false,
      //closeOnCancel: false
    }).then((result) => {
      if(result.value){
        let data = Object.assign({ "userId": localStorage.getItem('userId'), "productId": item._id, "main_category": item.main_category, "sub_category": item.sub_category, "sub_sub_category": item.sub_sub_category });
        console.log(data);
        this.apiService.deleteProduct(data).subscribe(result => {
          if(result['status'] == 200){
            this.http.post(`${environment.synchServerAddress}deleteproduct`, data).map(result => result.json())
            .subscribe((elasticdata: any) => {
              console.log("going to fetch prod list again", elasticdata);
              Swal({
                title: result['data'],
                text: "Successfully deleted!",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                //closeOnConfirm: false,
                //closeOnCancel: false
              }).then((result) => {
                // this.router.navigate(["/layout/product-list"]);
                this.getAllProducts();
              });
              // this.getAllProducts();
              // this.router.navigate(["/layout/product-list"]);
            });
          }
          else{
            Swal({
              title: result['data'],
              text: "You won't be able to revert this!",
              type: 'error',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Something went wrong delete the product!'
              //closeOnConfirm: false,
              //closeOnCancel: false
            }).then((result) => {
              // this.router.navigate(["/layout/product-list"]);
              this.getAllProducts();
            });
          }
        });
      }
    });
  }

  onEdit(item) {
    this.router.navigateByUrl(`/layout/product-edit/${item._id}`)
  }


  homeConfigData: any = [];
  homeConfigSection1: any = [];
  homeConfigSection2: any = [];
  homeConfigSection3: any = [];
  section_1 = [];
  section2 = [];
  section3 = [];
  section1_title = '';
  section2_title = '';
  section3_title = '';
  section_title = 'Enter section title';

  private getHomeConfig() {
    let data = Object.assign({ "userId": localStorage.getItem('userId') });
    this.apiService.getHomeConfig(data)
      .subscribe((data) => {
        console.log(data)
        if (data && data.sections && data.sections.length > 0) {
          this.homeConfigData = data;
          this.setHomeConfigData(data.sections[0])
        }
      });
  }

  async setHomeConfigData(sec) {
    let self = this;
    Object.keys(sec).map(function (key) {
      if (key == 'section_1') {
        self.section_1 = sec[key].products ? sec[key].products : [];
        self.section1_title = sec[key].title ? sec[key].title : self.section_title;
      } else if (key == 'section_2') {
        self.section2 = sec[key].products ? sec[key].products : [];
        self.section2_title = sec[key].title ? sec[key].title : self.section_title;
      } else if (key == 'section_3') {
        self.section3 = sec[key].products ? sec[key].products : [];
        self.section3_title = sec[key].title ? sec[key].title : self.section_title;
      }
    });
  }

  addPtoductSection(item){
    console.log(item);

    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1']
    }).queue([
      // {
      //   title: 'Theme',
      //   text: 'Select a theme',
      //   input: 'select',
      //   inputOptions: {
      //     'theme1': 'Theme 1',
      //   },
      // },
      {
        title: 'Section?',
        text: 'Which section of the Homepage you wish to display this Product?',
        input: 'select',
        inputOptions: {
          'section1': 'Section 1',
          'section2': 'Section 2',
          'section3': 'Section 3',
          // 'section4': 'Section 4',
        },
      }
    ]).then((result) => {
      console.log(result);
      if (result.value) {
        // let theme = result.value[0];
        let section = result.value[0];
        if(section){
          this.product_add_and_save('theme', section, item);
        }
      }
    });

  }

  product_add_and_save(theme, section, productData){
    let pData = {
      _id: productData._id,
      title: productData.title,
      short_title: productData.short_title,
      attributes : productData.attributes ? productData.attributes : '',
      // price: productData.price ? productData.price : '',
      gst: productData.gst ? productData.gst : '',
      size: productData.size,
      mainImage: [{
        'location': productData.mainImage[0].location
      }],
      otherImages: productData.otherImages

      // otherImages: [
      //   {
      //     'images': productData.otherImages
      //   }
      // ]
    }

    console.log(pData);
    console.log(section)
    if(section == 'section1'){
      if(this.section_1.length < 4){
        this.section_1.push(pData);
      }else{
          this.displayAlert('Sorry!', 'Section 1 are full, please try to add in another section', 'error');
          return;
      }
    }else if(section == 'section2'){
      if(this.section2.length < 4){
        this.section2.push(pData);
      }else{
          this.displayAlert('Sorry!', 'Section 2 are full, please try to add in another section', 'error');
          return;
      }
    }else if(section == 'section3'){
      if(this.section3.length < 4){
        this.section3.push(pData);
      }else{
          this.displayAlert('Sorry!', 'Section 3 are full, please try to add in another section', 'error');
          return;
      }
    }else{
      return;
    }
   


    this.homeConfigSection1 = [];
    this.homeConfigSection2 = [];
    this.homeConfigSection3 = [];

    for (let i = 0; i < this.section_1.length; i++) {
      let data1 = {
        _id: this.section_1[i]._id,
        title: this.section_1[i].title,
        short_title: this.section_1[i].short_title,
        // price: this.section_1[i].price ? this.section_1[i].price : '',
        attributes: this.section_1[i].attributes ? this.section_1[i].attributes : '',
        gst: this.section_1[i].gst ? this.section_1[i].gst : '',
        size: this.section_1[i].size,
        mainImage: [{
          'location': this.section_1[i].mainImage[0].location
        }],
        otherImages: this.section_1[i].otherImages
        // otherImages: [
        //   {
        //     'images': this.section_1[i].otherImages
        //   }
        // ]
      }
      this.homeConfigSection1.push(data1)
    }

    for (let i = 0; i < this.section2.length; i++) {
      let data2 = {
        _id: this.section2[i]._id,
        title: this.section2[i].title,
        short_title: this.section2[i].short_title,
        // price: this.section2[i].price ? this.section2[i].price : '',
        attributes: this.section2[i].attributes ? this.section2[i].attributes : '',
        gst: this.section2[i].gst ? this.section2[i].gst : '',
        size: this.section2[i].size,
        mainImage: [{
          'location': this.section2[i].mainImage[0].location
        }],
        otherImages: this.section2[i].otherImages
        // otherImages: [
        //   {
        //     'images': this.section2[i].otherImages
        //   }
        // ]
      }
      this.homeConfigSection2.push(data2)
    }

    for (let i = 0; i < this.section3.length; i++) {
      let data3 = {
        _id: this.section3[i]._id,
        title: this.section3[i].title,
        short_title: this.section3[i].short_title,
        // price: this.section3[i].price ? this.section3[i].price : '',
        attributes: this.section3[i].attributes ? this.section3[i].attributes : '',
        gst: this.section3[i].gst ? this.section3[i].gst : '',
        size: this.section3[i].size,
        mainImage: [{
          'location': this.section3[i].mainImage[0].location
        }],
        otherImages: this.section3[i].otherImages
        // otherImages: [
        //   {
        //     'images': this.section3[i].otherImages
        //   }
        // ]
      }
      this.homeConfigSection3.push(data3)
    }

    let homeData = {
      _id: localStorage.getItem('userId'),
      userId: localStorage.getItem('userId'),
      sections: {
        section_1: {
          title: this.section1_title,
          products: this.homeConfigSection1
        },
        section_2: {
          title: this.section2_title,
          products: this.homeConfigSection2
        },
        section_3: {
          title: this.section3_title,
          products: this.homeConfigSection3
        }
      }
    }

    console.log(homeData);

    this.apiService.saveHomeConfig(Object.assign(homeData)).subscribe((result_data: any) => {
      if (result_data && result_data.status == 'success') {
        this.displayAlert('Success', 'You have successfully updated your homepage design', 'success');
      } else {
        this.displayAlert('Sorry!', 'Server error please try again later', 'error');
      }
    }, error => {
      console.log("error", error);
      this.displayAlert('Sorry!', 'Server error please try again later', 'error');
    });
  }

  displayAlert(title, text, type){
    Swal({title,text,type,showCancelButton: false,confirmButtonColor: '#3085d6',confirmButtonText: 'OK'});
  }

  getFacebookUrl(id, websiteURL){
    let url = "http://www.facebook.com/sharer.php?u=https://"+websiteURL+"/product-detail.php?p="+id;
    // let url = "http://www.facebook.com/sharer.php?u=https://rubysheikh.com/product-detail.php?p=6065d01ae1b354d230f86231";
    return url.replace(/&amp;/g, '&');
  }

}
