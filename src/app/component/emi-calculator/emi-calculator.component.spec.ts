import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmiCalculatorComponent } from './emi-calculator.component';
import { of, throwError } from 'rxjs';
import { LoanDetailsService } from '../../service/loan-details.service';

describe('EmiCalculatorComponent', () => {
  let component: EmiCalculatorComponent;
  let fixture: ComponentFixture<EmiCalculatorComponent>;

  beforeEach(async () => {
    const mockLoansService = {
      calculateEmi: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, FormsModule, EmiCalculatorComponent],
      providers: [
        {
          provide: LoanDetailsService,
          useValue: mockLoansService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.emiForm).toBeDefined();
  });

  it('should calculate EMI on form submission', () => {
    const loanDetailsService = TestBed.inject(LoanDetailsService);
    jest.spyOn(loanDetailsService, 'calculateEmi').mockReturnValue(
      of({
        monthlyInstallment: 224,
      })
    );
    component.emiForm.patchValue({
      principal: 100000,
      yearlyRateOfInterest: 10,
      tenureInYears: 5,
      email: 'test@example.com',
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.monthlyInstallment).toBe(224);
    expect(component.hasError).toBeFalsy();
  });

  it('should set hasError to true when backend call fails', () => {
    const loanDetailsService = TestBed.inject(LoanDetailsService);
    jest
      .spyOn(loanDetailsService, 'calculateEmi')
      .mockReturnValue(
        throwError(() => new Error('Error Occurred while callling Backend'))
      );
    component.emiForm.patchValue({
      principal: 100000,
      yearlyRateOfInterest: 10,
      tenureInYears: 5,
      email: 'test@example.com',
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.hasError).toBeTruthy();
  });
});
