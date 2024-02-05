import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoanDetailsRequest,
  LoanDetailsResponse,
} from './loan-details.interface';
import { CALCULATE_EMI_URL } from './loan-details.constants';

@Injectable({
  providedIn: 'root',
})
export class LoanDetailsService {
  constructor(private http: HttpClient) {}

  calculateEmi(request: LoanDetailsRequest): Observable<LoanDetailsResponse> {
    return this.http.post<LoanDetailsResponse>(CALCULATE_EMI_URL, request);
  }
}
