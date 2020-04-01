import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationzoneComponent } from './locationzone.component';

describe('LocationzoneComponent', () => {
  let component: LocationzoneComponent;
  let fixture: ComponentFixture<LocationzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
