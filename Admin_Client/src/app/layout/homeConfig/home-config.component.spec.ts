import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeConfigComponent } from './home-config.component';

describe('HomeConfigComponent', () => {
  let component: HomeConfigComponent;
  let fixture: ComponentFixture<HomeConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
