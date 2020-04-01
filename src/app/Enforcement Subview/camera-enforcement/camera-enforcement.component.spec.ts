import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraEnforcementComponent } from './camera-enforcement.component';

describe('CameraEnforcementComponent', () => {
  let component: CameraEnforcementComponent;
  let fixture: ComponentFixture<CameraEnforcementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraEnforcementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraEnforcementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
