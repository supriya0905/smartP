import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutslotComponent } from './doughnutslot.component';

describe('DoughnutslotComponent', () => {
  let component: DoughnutslotComponent;
  let fixture: ComponentFixture<DoughnutslotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoughnutslotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoughnutslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
