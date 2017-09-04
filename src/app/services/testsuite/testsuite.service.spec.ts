import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthenticationService, LocalStorageService } from '../auth/index';
import { TestsuiteService } from './testsuite.service';

describe('TestsuiteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthenticationService,
        LocalStorageService,
        TestsuiteService
      ]
    });
  });

  it('should ...', inject([TestsuiteService], (service: TestsuiteService) => {
    expect(service).toBeTruthy();
  }));
});
