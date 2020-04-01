import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraslotComponent } from './cameraslot.component';

describe('CameraslotComponent', () => {
  let component: CameraslotComponent;
  let fixture: ComponentFixture<CameraslotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraslotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
