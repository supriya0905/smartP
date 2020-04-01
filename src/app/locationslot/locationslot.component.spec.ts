import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationslotComponent } from './locationslot.component';

describe('LocationslotComponent', () => {
  let component: LocationslotComponent;
  let fixture: ComponentFixture<LocationslotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationslotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
