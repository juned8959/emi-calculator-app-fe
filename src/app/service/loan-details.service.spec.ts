import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoanDetailsService } from './loan-details.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LoanDetailsResponse } from './loan-details.interface';

describe('LoanDetailsService', () => {
  let service: LoanDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideHttpClientTesting],
    });
    service = TestBed.inject(LoanDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call httpClient when calculateEmi is called', (done) => {
    const httpClient = TestBed.inject(HttpClient);
    const httpPostSpy = jest
      .spyOn(httpClient, 'post')
      .mockReturnValue(of({ monthlyInstallment: 1174 }));

    service
      .calculateEmi({
        email: 'example@example.com',
        principal: 1000000,
        tenureInYears: 10,
        yearlyRateOfInterest: 7.2,
      })
      .subscribe((result: LoanDetailsResponse) => {
        expect(result.monthlyInstallment).toEqual(1174);
        expect(httpPostSpy).toHaveBeenCalledTimes(1);
        done();
      });
  });
});
