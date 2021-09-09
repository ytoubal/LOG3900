import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AttributsPanelComponent } from '../attributs-panel/attributs-panel.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { ToolsComponent } from '../tools/tools.component';
import { WorkplacePageComponent } from './workplace-page.component';

describe('WorkplacePageComponent', () => {
  let component: WorkplacePageComponent;
  let fixture: ComponentFixture<WorkplacePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MatDialogModule, MatSnackBarModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ WorkplacePageComponent, ToolsComponent, AttributsPanelComponent, CanvasComponent ],
      providers: [{provide: MatDialogRef, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplacePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onResize when the window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize').and.callThrough();
    window.dispatchEvent(new Event('resize'));
    expect(spyOnResize).toHaveBeenCalled();
  });
});
