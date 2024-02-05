import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LoanDetailsService } from '../../service/loan-details.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoanDetailsResponse } from '../../service/loan-details.interface';

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './emi-calculator.component.html',
  styleUrl: './emi-calculator.component.scss',
})
export class EmiCalculatorComponent implements OnInit, OnDestroy {
  emiForm!: FormGroup;
  loanDetailsSubscription: Subscription | undefined;
  monthlyInstallment: number | undefined;
  loading: boolean = false;
  hasError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loanDetailsService: LoanDetailsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.loanDetailsSubscription) {
      this.loanDetailsSubscription.unsubscribe();
    }
  }

  initializeForm(): void {
    this.emiForm = this.formBuilder.group({
      principal: [
        '',
        [
          Validators.required,
          Validators.min(0),
          this.validatePositiveInput(),
          this.validateLoanAmount,
        ],
      ],
      yearlyRateOfInterest: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          this.validatePositiveInput(),
        ],
      ],
      tenureInYears: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(30),
          this.validatePositiveInput(),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.hasError = false;
    this.loading = true;
    this.loanDetailsSubscription = this.loanDetailsService
      .calculateEmi(this.emiForm.value)
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
  }

  // Custom validator for loanAmount field
  validateLoanAmount(control: { value: any }): { [key: string]: any } | null {
    const amount = control.value;
    if (amount === null || amount.toString().length > 12) {
      return { invalidLoanAmount: true };
    }
    return null;
  }

  // Custom validator for positive input
  validatePositiveInput(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputValue = control.value;
      if (inputValue === null || inputValue <= 0) {
        return { hasInputValueError: true };
      }
      return null;
    };
  }

  private handleResponse(loanDetailsResponse: LoanDetailsResponse) {
    this.monthlyInstallment = loanDetailsResponse.monthlyInstallment;
    this.loading = false;
    this.hasError = false;
  }

  private handleError() {
    this.loading = false;
    this.hasError = true;
  }
}
