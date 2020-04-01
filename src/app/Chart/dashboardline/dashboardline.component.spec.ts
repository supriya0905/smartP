import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardlineComponent } from './dashboardline.component';

describe('DashboardlineComponent', () => {
  let component: DashboardlineComponent;
  let fixture: ComponentFixture<DashboardlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
