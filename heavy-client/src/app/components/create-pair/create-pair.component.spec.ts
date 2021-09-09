import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePairComponent } from './create-pair.component';

describe('CreatePairComponent', () => {
  let component: CreatePairComponent;
  let fixture: ComponentFixture<CreatePairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
