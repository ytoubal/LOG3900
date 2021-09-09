import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoomDialogComponent } from './new-room-dialog.component';

describe('NewRoomDialogComponent', () => {
  let component: NewRoomDialogComponent;
  let fixture: ComponentFixture<NewRoomDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRoomDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
