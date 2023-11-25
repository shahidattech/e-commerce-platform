import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { shippedOrderListComponent } from './shippedOrder-list.component';

describe('ProductListComponent', () => {
  let component: shippedOrderListComponent;
  let fixture: ComponentFixture<shippedOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ shippedOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(shippedOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
