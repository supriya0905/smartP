import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOccupancyComponent } from './all-occupancy.component';

describe('AllOccupancyComponent', () => {
  let component: AllOccupancyComponent;
  let fixture: ComponentFixture<AllOccupancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllOccupancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOccupancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
