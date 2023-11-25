import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewedProductListComponent } from './reviewed-product-list.component';

describe('ProductListComponent', () => {
  let component: ReviewedProductListComponent;
  let fixture: ComponentFixture<ReviewedProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewedProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewedProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
