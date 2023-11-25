import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeConfigTheme2Component } from './home-config.component';

describe('HomeConfigTheme2Component', () => {
  let component: HomeConfigTheme2Component;
  let fixture: ComponentFixture<HomeConfigTheme2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeConfigTheme2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeConfigTheme2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
