export interface LoanDetailsRequest {
  principal: number;
  yearlyRateOfInterest: number;
  tenureInYears: number;
  email: string;
}

export interface LoanDetailsResponse {
  monthlyInstallment: number;
}
