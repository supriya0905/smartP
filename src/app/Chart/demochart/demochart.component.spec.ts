import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemochartComponent } from './demochart.component';

describe('DemochartComponent', () => {
  let component: DemochartComponent;
  let fixture: ComponentFixture<DemochartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemochartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemochartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
