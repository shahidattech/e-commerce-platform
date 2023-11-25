import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSearchByDateComponent } from './order-search-by-date.component';

describe('ProductListComponent', () => {
  let component: OrderSearchByDateComponent;
  let fixture: ComponentFixture<OrderSearchByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSearchByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSearchByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
