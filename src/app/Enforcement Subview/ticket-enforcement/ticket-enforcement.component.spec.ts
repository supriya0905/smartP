import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEnforcementComponent } from './ticket-enforcement.component';

describe('TicketEnforcementComponent', () => {
  let component: TicketEnforcementComponent;
  let fixture: ComponentFixture<TicketEnforcementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEnforcementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEnforcementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
