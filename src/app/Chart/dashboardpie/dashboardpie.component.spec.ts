import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardpieComponent } from './dashboardpie.component';

describe('DashboardpieComponent', () => {
  let component: DashboardpieComponent;
  let fixture: ComponentFixture<DashboardpieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardpieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardpieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
