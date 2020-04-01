import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulemasterComponent } from './modulemaster.component';

describe('ModulemasterComponent', () => {
  let component: ModulemasterComponent;
  let fixture: ComponentFixture<ModulemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
