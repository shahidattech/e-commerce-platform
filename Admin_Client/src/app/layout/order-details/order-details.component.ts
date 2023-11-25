import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'ngbd-modal-confirm-autofocus',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']
  })
  export class ngbdModalConfirmAutofocus {
    @Input() orderDetails;
    data: any;
  
    constructor(public modal: NgbActiveModal) {
    }
  
    ngOnInit() {
      this.data = this.orderDetails.data;
    }

    total(order, charges){
        return parseInt(order) + parseInt(charges);
    }
  
  }