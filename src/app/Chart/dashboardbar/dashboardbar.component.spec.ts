import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardbarComponent } from './dashboardbar.component';

describe('DashboardbarComponent', () => {
  let component: DashboardbarComponent;
  let fixture: ComponentFixture<DashboardbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
