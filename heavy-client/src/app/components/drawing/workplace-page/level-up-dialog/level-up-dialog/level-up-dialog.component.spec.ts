import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelUpDialogComponent } from './level-up-dialog.component';

describe('LevelUpDialogComponent', () => {
  let component: LevelUpDialogComponent;
  let fixture: ComponentFixture<LevelUpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelUpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
