import { inject, TestBed } from '@angular/core/testing';
import { ITool } from 'src/app/components/app/tool-interface/tool';
import { AttributsService } from './attributs.service';

describe('Service: Attributs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttributsService]
    });
  });

  it('should create', inject([AttributsService], (service: AttributsService) => {
    expect(service).toBeTruthy();
  }));

  it('#receiveTool should modify tool values', inject([AttributsService], (service: AttributsService) => {
    const tool: ITool = {
      name: 'Hammer',
      nameFR: 'Marteau',
      attributs: {},
      shortcut: 'H',
      isActive: false,
    };
    spyOn(service.myTool, 'next');
    service.receiveTool(tool);
    expect(service.myTool.next).toHaveBeenCalledWith(tool);
  }));
});
