import { Component, OnInit, Inject, Input, Type } from "@angular/core";
import { UserService } from '../../shared/services/user.service';
import { first } from 'rxjs/operators';
// import { User } from './user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ngbdModalConfirmAutofocus } from "../order-details/order-details.component";

@Component({
  selector: 'app-product-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

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
  // public rowsOnPage = 10;
  public page = 1;
  public sortBy = "userName";
  public sortOrder = "asc";
  orderForm: FormGroup;
  constructor(private http: Http, private router: Router, private userService: UserService, private apiService: apiService, private modalService: NgbModal, private _fb: FormBuilder, private spinner: NgxSpinnerService, private dialog: MatDialog) {
  }
  ngOnInit() {
    this.getOrderByUserId();
  }


  viewOrderDetails(item) {
    // console.log(item);
    let modalRef = this.modalService.open(ngbdModalConfirmAutofocus);
    modalRef.componentInstance.orderDetails = Object.assign({ "data": item });
  }


  // Get data from service
  private getOrderByUserId() {
    // let req_data = Object.assign({ "userId": localStorage.getItuserIdem('userId'), "page": 1 });
    // 6059ae7eb7192f4142140e8e
    // this.apiService.getOrderByUserId('6059ae7eb7192f4142140e8e', this.page)
    this.apiService.getOrderByUserId(localStorage.getItem('userId'), this.page)
      .subscribe((result) => {
        if (result['status'] == 200) {
          this.data = result['data'];
          console.log('65', this.data);
        }
        else if (result['status'] == 204) {
          Swal({
            title: 'Sorry !! ',
            text: " You have No Order received yet !",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            this.router.navigate(["/layout/dashboard"]);
          });
        }
        else {
          Swal({
            title: 'Sorry !!',
            text: "We are facing some technical issue right now, Please try later",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            this.router.navigate(["/layout/order-list"]);
          });
        }
      });
  }
  next() {
    this.page = this.page + 1;
    this.ngOnInit();
  }

  prev() {
    this.page = this.page - 1;
    this.ngOnInit();
  }

  //Get Roles Lit

  public toInt(num: string) {
    return +num;
  }


  addAritcle(data) {
    // console.log(this.user_activate.get('articles').value);
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
      let data = Object.assign({ "userId": localStorage.getItem('userId'), "productId": item._id });
      // console.log(data);
      this.apiService.deleteProduct(data).subscribe(result => {
        if (result['status'] == 200) {
          this.http.post(`${environment.synchServerAddress}deleteproduct`, data).map(result => result.json())
            .subscribe((elasticdata: any) => {
              // console.log("elasticdata_Result", elasticdata);
              this.router.navigate(["/layout/product-list"]);
            });
        }
        else {
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
            this.router.navigate(["/layout/product-list"]);
          });
        }
      });
    });
  }

  onEdit(item) {
    this.router.navigateByUrl(`/layout/forms/${item._id}`)
  }

  shipNow(data) {
    // console.log('Data=', data);
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3', '4']
    }).queue([
      {
        title: 'Length(Length of the Parcel)?',
        text: 'Please enter length of the product (in cm)'
      },
      {
        title: 'Breadth(Breadth of the Parcel)?',
        text: 'Please enter product breadth (in cm)'
      },
      {
        title: 'Height(Height of the Parcel)?',
        text: 'Please enter product height (in cm)'
      },
      {
        title: 'Weight(Weight of the Parcel)?',
        text: 'Please enter product weight (in kg)'
      }
    ]).then((result) => {
      // console.log(result);
      if (result.value) {
        let shippingSata = {
          "sellerId": localStorage.getItem('userId'),
          "data": Object.assign({
            "length": result.value[0],
            "breadth": result.value[1],
            "height": result.value[2],
            "weight": result.value[3]
          }, data)
        };
        this.shipCreateOrder(shippingSata);
      }
    });
  }

  shipCreateOrder(shippingSata) {
    // console.log('shippingSata 191', shippingSata);
    this.spinner.show();
    this.apiService.shipmentCreateOrder(shippingSata)
      .then(result => {
        this.spinner.hide();
        console.log('Response', result);
        if (result["status"] == "SUCCESS") {
          var body = Object.assign({ "data": result, "orderId": shippingSata["data"]._id });

          const modalRef = this.modalService.open(ServiceAvailableModalComponent);
          modalRef.componentInstance.data = body;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          // dialogConfig.autoFocus = true;
          // dialogConfig.data = { body };
          // this.dialog.open(serviceAvailabilityComponent, dialogConfig);
        }
        else {

        }
      });
  }

}


@Component({
  selector: 'service-available-modal',
  templateUrl: './service-available-modal.component.html',
  styleUrls: ['./service-available-modal.component.css']
})

export class ServiceAvailableModalComponent {
  @Input() data;
  getBodyData: any;
  covid_zone: any;
  payment_method: any;
  channel_order_id: any;
  rows: any = [];
  sellerId: any;
  orderId: any;

  constructor(public activeModal: NgbActiveModal, private router: Router, private apiService: apiService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    console.log('Confirming ship', this.data);

    this.getBodyData = this.data['data'];
    // console.log('this.getBodyData ', this.getBodyData);

    if (this.getBodyData['status'] == 'SUCCESS') {
      this.rows = this.getBodyData['data'];
      if (this.getBodyData["data"]['covid_zone']) {
        this.covid_zone = this.getBodyData["data"]['covid_zone'];
      }
      this.sellerId = this.getBodyData.seller_id;
      this.channel_order_id = this.getBodyData.channel_order_id;
      this.payment_method = this.getBodyData.payment_method;
      this.orderId = this.data.orderId;
      // console.log('orderId', this.orderId);
    }
    else {
      // console.log('ERROR ', this.getBodyData['data']);
      Swal({
        title: 'Error placing the Order in Shipping system, Please contact Support',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
        //closeOnConfirm: false,
        //closeOnCancel: false
      }).then((result) => {
        this.router.navigate(["/layout/websiteorders"]);
      });

    }
  }

  shipOrder(row) {
    var formData = {
      "courier_company_id": row["courier_company_id"],
      "sellerId": this.sellerId,
      "rate": row["gross_shipping_charge"],
      "channel_order_id": this.channel_order_id
    }
    this.spinner.show();
    this.apiService.generatePickup(formData).then(pickupgeneration_response => {
      this.spinner.hide();
      // console.log('pickupgeneration_response=', pickupgeneration_response);
      if (pickupgeneration_response['status'] == 'INVALID_SUBS') {
        // console.log("Error:", pickupgeneration_response['data'], 'INVALID_SUBS');
        Swal({
          title: 'Error',
          text: pickupgeneration_response['data'],
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
          //closeOnConfirm: false,
          //closeOnCancel: false
        }).then((result) => {

          this.router.navigate(["/layout/websiteorders"]);
        });
        // this.router.navigate(['/subscription']);
      }
      else if (pickupgeneration_response['status'] == "INVALID_CREDIT") {
        // console.log("Error:", pickupgeneration_response['data'], 'INVALID_CREDIT');
        Swal({
          title: 'Error',
          text: pickupgeneration_response['data'],
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
          //closeOnConfirm: false,
          //closeOnCancel: false
        }).then((result) => {
          this.router.navigate(["/layout/websiteorders"]);
        });
        // this.router.navigate(['/shippingcredit']);
      }
      else if (pickupgeneration_response['status'] == 'SUCCESS') {
        // console.log("SUCCESS:", pickupgeneration_response['data'], 'SUCCESS');
        let data = {
          "seller_id": localStorage.getItem('userId'),
          "order_id": this.orderId,
          "Awb_Number": pickupgeneration_response["Awb_Number"],
          "labelURL": pickupgeneration_response["labelURL"],
          "status": "PICKUP_GENERATED"
        };
        this.apiService.updateOrderStatus(data).subscribe(result => {
          if (result['status'] == 200) {
            Swal({
              title: 'Success',
              text: pickupgeneration_response['data'],
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
              //closeOnConfirm: false,
              //closeOnCancel: false
            }).then((result) => {
              this.router.navigate(["/layout/shippedorders"]);
            });
          }
          else {
            this.router.navigate(["/layout/websiteorders"]);
          }
        });
      }
      else if (pickupgeneration_response['status'] == 'FAILED') {
        // console.log("Error:", pickupgeneration_response['data']);
        Swal({
          title: 'Error',
          text: pickupgeneration_response['data'],
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
          //closeOnConfirm: false,
          //closeOnCancel: false
        }).then((result) => {
          this.router.navigate(["/layout/websiteorders"]);
        });
        this.router.navigate(['/dashboards']);
      }
      else {
        this.router.navigate(['/dashboards']);
      }
    });
  }
}


@Component({
  selector: 'app-add-admin-thank',
  templateUrl: './service-availability.component.html',
})
export class serviceAvailabilityComponent {
  error: string;
  steps: any;
  sellerId: any
  rows = [];

  getBodyData: any;
  covid_zone: any;
  payment_method: any;
  channel_order_id: any;

  constructor(private router: Router, private apiService: apiService,
    public dialogRef: MatDialogRef<serviceAvailabilityComponent>, @Inject(MAT_DIALOG_DATA) data) {
    // console.log("Response", data)
    this.getBodyData = data.body;

    if (this.getBodyData['result_service_provider']['status'] == 'SUCCESS') {
      this.rows = this.getBodyData["result_service_provider"]['data'];
      if (this.getBodyData["result_service_provider"]['covid_zone']) {
        this.covid_zone = this.getBodyData["result_service_provider"]['covid_zone'];
      }
      this.sellerId = this.getBodyData.sellerId;
      this.channel_order_id = this.getBodyData.channel_order_id;
      this.payment_method = this.getBodyData.payment_method;
      // console.log('payment_method', this.payment_method);
    }
    else {
      // console.log('ERROR ', this.getBodyData["result_service_provider"]['data']);
      alert('ERROR ' + this.getBodyData["result_service_provider"]['data']);
    }
  }
  ngOnInit() {
  }
  finish() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  shipOrder(row) {
    var formData = {
      "courier_company_id": row["courier_company_id"],
      "sellerId": this.sellerId,
      "rate": row["rate"],
      "channel_order_id": this.channel_order_id
    }

    this.apiService.generatePickup(formData).then(pickupgeneration_response => {
      // console.log('pickupgeneration_response=', pickupgeneration_response);
      if (pickupgeneration_response['status'] == 'INVALID_SUBS') {
        // console.log("Error:", pickupgeneration_response['data'], 'INVALID_SUBS');
        alert("Error: " + pickupgeneration_response['data'] + ' INVALID_SUBS');
        this.router.navigate(['/subscription']);
      }
      else if (pickupgeneration_response['status'] == "INVALID_CREDIT") {
        // console.log("Error:", pickupgeneration_response['data'], 'INVALID_CREDIT');
        alert("Error: " + pickupgeneration_response['data'] + ' INVALID_CREDIT');
        this.router.navigate(['/shippingcredit']);
      }
      else if (pickupgeneration_response['status'] == 'SUCCESS') {
        // console.log("SUCCESS:", pickupgeneration_response['data'], 'SUCCESS');
        alert("SUCCESS: " + pickupgeneration_response['data'] + ' SUCCESS');
        this.router.navigate(['/orders/list']);

      }
      else if (pickupgeneration_response['status'] == 'FAILED') {
        // console.log("Error:", pickupgeneration_response['data']);
        alert("Error: " + pickupgeneration_response['data']);
        this.router.navigate(['/dashboards']);
      }
      else {

      }
    })
  }
}