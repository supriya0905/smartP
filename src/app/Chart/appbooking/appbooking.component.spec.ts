import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppbookingComponent } from './appbooking.component';

describe('AppbookingComponent', () => {
  let component: AppbookingComponent;
  let fixture: ComponentFixture<AppbookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppbookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
