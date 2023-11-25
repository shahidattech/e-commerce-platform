import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSlideShowComponent } from './get-slide-show.component';

describe('GetSlideShowComponent', () => {
  let component: GetSlideShowComponent;
  let fixture: ComponentFixture<GetSlideShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetSlideShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSlideShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
