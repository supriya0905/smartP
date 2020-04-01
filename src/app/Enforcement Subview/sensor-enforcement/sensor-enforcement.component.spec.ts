import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorEnforcementComponent } from './sensor-enforcement.component';

describe('SensorEnforcementComponent', () => {
  let component: SensorEnforcementComponent;
  let fixture: ComponentFixture<SensorEnforcementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorEnforcementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorEnforcementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
