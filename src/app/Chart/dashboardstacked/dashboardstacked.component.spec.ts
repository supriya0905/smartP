import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardstackedComponent } from './dashboardstacked.component';

describe('DashboardstackedComponent', () => {
  let component: DashboardstackedComponent;
  let fixture: ComponentFixture<DashboardstackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardstackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardstackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
