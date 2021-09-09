import { inject, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { UrlService } from './url.service';

describe('Service: Url', () => {

  let urlService: UrlService;

  const eventSubject = new ReplaySubject<RouterEvent>(1);

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'test/url'
  };

  beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {provide: Router, useValue: routerMock}
        ]
      });
    });

  beforeEach(inject([Router], (service: Router) => {
      urlService = new UrlService(service);
    }));

  it('should create', inject([UrlService], (service: UrlService) => {
    expect(urlService).toBeTruthy();
  }));

  it('should set the currentRoute correctly', () => {
    eventSubject.next(new NavigationEnd(1, 'regular', 'redirectUrl'));
    expect(urlService.previousUrl).toBe('test/url');
    expect(urlService.currentUrl).toBe('regular');
  });

  it ('should not change the previous and current url', () => {
    urlService.currentUrl = 'CURRENT';
    urlService.previousUrl = 'PREVIOUS';
    eventSubject.next();
    expect(urlService.currentUrl).toBe('CURRENT');
    expect(urlService.previousUrl).toBe('PREVIOUS');
  });

});
