import { Component, OnInit, Inject, Input, Type } from "@angular/core";
import { UserService } from '../../shared/services/user.service';
import { first } from 'rxjs/operators';
// import { User } from './user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-order-search-by-date',
  templateUrl: './order-search-by-date.component.html',
  styleUrls: ['./order-search-by-date.component.scss']
})
export class OrderSearchByDateComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

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


  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;


  constructor(private http: Http, calendar: NgbCalendar, private router: Router, private userService: UserService, private apiService: apiService, private modalService: NgbModal, private _fb: FormBuilder, private spinner: NgxSpinnerService, private dialog: MatDialog) {
    this.fromDate = calendar.getNext(calendar.getToday(), 'd', -2);
    this.toDate = calendar.getToday();
  }

  ngOnInit() {
  }

  viewOrderDetails(item) {
    console.log(item);
    let modalRef = this.modalService.open(ngbdModalConfirmAutofocus);
    modalRef.componentInstance.orderDetails = Object.assign({ "data": item });
  }

  onDateSelection(date: NgbDate) {
    console.log(date);
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  searchOrder() {
    this.spinner.show();
    let startDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    let endDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    let req_data = Object.assign({ "userId": localStorage.getItem('userId'), 'startDate': startDate, 'endDate': endDate });
    console.log(req_data);

    // 6059ae7eb7192f4142140e8e
    this.apiService.getOrderByDate(localStorage.getItem('userId'), this.page, req_data)
      .subscribe((result) => {
        this.spinner.hide();
        if (result['status'] == 200) {
          this.data = result['data'];
          console.log(this.data);
          if (this.data.length == 0) {
            Swal({
              title: 'Sorry !! ',
              text: " No records found from " + startDate + " to " + endDate,
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            });
          }
        }
        else if (result['status'] == 204) {
          Swal({
            title: 'Sorry !! ',
            text: " You have No Order received yet !",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
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
          });
        }
      }, err => {
        this.spinner.hide();
      });
  }

  public toInt(num: string) {
    return +num;
  }


  addAritcle(data) {
    console.log(this.user_activate.get('articles').value);
  }

  shipNow(data) {
    console.log('Data=', data);
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
      console.log(result);
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
    console.log('shippingSata 191', shippingSata);
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
    console.log('this.getBodyData ', this.getBodyData);

    if (this.getBodyData['status'] == 'SUCCESS') {
      this.rows = this.getBodyData['data'];
      if (this.getBodyData["data"]['covid_zone']) {
        this.covid_zone = this.getBodyData["data"]['covid_zone'];
      }
      this.sellerId = this.getBodyData.seller_id;
      this.channel_order_id = this.getBodyData.channel_order_id;
      this.payment_method = this.getBodyData.payment_method;
      this.orderId = this.data.orderId;
      console.log('orderId', this.orderId);
    }
    else {
      console.log('ERROR ', this.getBodyData['data']);
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
      "rate": row["rate"],
      "channel_order_id": this.channel_order_id
    }
    this.spinner.show();
    this.apiService.generatePickup(formData).then(pickupgeneration_response => {
      this.spinner.hide();
      console.log('pickupgeneration_response=', pickupgeneration_response);
      if (pickupgeneration_response['status'] == 'INVALID_SUBS') {
        console.log("Error:", pickupgeneration_response['data'], 'INVALID_SUBS');
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
        console.log("Error:", pickupgeneration_response['data'], 'INVALID_CREDIT');
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
        console.log("SUCCESS:", pickupgeneration_response['data'], 'SUCCESS');
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
        console.log("Error:", pickupgeneration_response['data']);
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
    console.log("Response", data)
    this.getBodyData = data.body;

    if (this.getBodyData['result_service_provider']['status'] == 'SUCCESS') {
      this.rows = this.getBodyData["result_service_provider"]['data'];
      if (this.getBodyData["result_service_provider"]['covid_zone']) {
        this.covid_zone = this.getBodyData["result_service_provider"]['covid_zone'];
      }
      this.sellerId = this.getBodyData.sellerId;
      this.channel_order_id = this.getBodyData.channel_order_id;
      this.payment_method = this.getBodyData.payment_method;
      console.log('payment_method', this.payment_method);
    }
    else {
      console.log('ERROR ', this.getBodyData["result_service_provider"]['data']);
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
      console.log('pickupgeneration_response=', pickupgeneration_response);
      if (pickupgeneration_response['status'] == 'INVALID_SUBS') {
        console.log("Error:", pickupgeneration_response['data'], 'INVALID_SUBS');
        alert("Error: " + pickupgeneration_response['data'] + ' INVALID_SUBS');
        this.router.navigate(['/subscription']);
      }
      else if (pickupgeneration_response['status'] == "INVALID_CREDIT") {
        console.log("Error:", pickupgeneration_response['data'], 'INVALID_CREDIT');
        alert("Error: " + pickupgeneration_response['data'] + ' INVALID_CREDIT');
        this.router.navigate(['/shippingcredit']);
      }
      else if (pickupgeneration_response['status'] == 'SUCCESS') {
        console.log("SUCCESS:", pickupgeneration_response['data'], 'SUCCESS');
        alert("SUCCESS: " + pickupgeneration_response['data'] + ' SUCCESS');
        this.router.navigate(['/orders/list']);

      }
      else if (pickupgeneration_response['status'] == 'FAILED') {
        console.log("Error:", pickupgeneration_response['data']);
        alert("Error: " + pickupgeneration_response['data']);
        this.router.navigate(['/dashboards']);
      }
      else {

      }
    })
  }
}