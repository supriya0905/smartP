import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutdashboardComponent } from './doughnutdashboard.component';

describe('DoughnutdashboardComponent', () => {
  let component: DoughnutdashboardComponent;
  let fixture: ComponentFixture<DoughnutdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoughnutdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoughnutdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
