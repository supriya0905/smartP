import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonecameraComponent } from './zonecamera.component';

describe('ZonecameraComponent', () => {
  let component: ZonecameraComponent;
  let fixture: ComponentFixture<ZonecameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonecameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonecameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
