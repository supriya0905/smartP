import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmodulemasterComponent } from './submodulemaster.component';

describe('SubmodulemasterComponent', () => {
  let component: SubmodulemasterComponent;
  let fixture: ComponentFixture<SubmodulemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmodulemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmodulemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
