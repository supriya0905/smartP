import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeofpaymentdoughnutComponent } from './modeofpaymentdoughnut.component';

describe('ModeofpaymentdoughnutComponent', () => {
  let component: ModeofpaymentdoughnutComponent;
  let fixture: ComponentFixture<ModeofpaymentdoughnutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeofpaymentdoughnutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeofpaymentdoughnutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
