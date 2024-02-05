import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmiCalculatorComponent } from './component/emi-calculator/emi-calculator.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmiCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'emi-calculator-app';
}
