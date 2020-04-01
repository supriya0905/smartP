import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterEnforcementComponent } from './meter-enforcement.component';

describe('MeterEnforcementComponent', () => {
  let component: MeterEnforcementComponent;
  let fixture: ComponentFixture<MeterEnforcementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterEnforcementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterEnforcementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
