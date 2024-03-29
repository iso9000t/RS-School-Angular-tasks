import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/password-validator';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailTakenValidator } from '../validators/last-email.validator';
import { Router } from '@angular/router';
import { nameValidator } from '../validators/name.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  isSubmitting: boolean = false;
  takenEmails: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  registrationForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, nameValidator()]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        emailTakenValidator(this.takenEmails),
      ],
    ],
    password: ['', [Validators.required, passwordValidator()]],
  });

  private toggleSubmitButtonAndForm() {
    this.isSubmitting = !this.isSubmitting;
    if (this.isSubmitting) {
      this.registrationForm.disable();
    } else {
      this.registrationForm.enable();
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.toggleSubmitButtonAndForm();
      this.authService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/signin']);
        },
        error: (err) => {
          if (err.error.type === 'PrimaryDuplicationException') {
            const failedEmail = this.registrationForm.value.email;
            if (!this.takenEmails.includes(failedEmail)) {
              this.takenEmails.push(failedEmail);
            }

            this.registrationForm
              .get('email')
              ?.setValidators([
                Validators.required,
                Validators.email,
                emailTakenValidator(this.takenEmails),
              ]);
            this.registrationForm.get('email')?.updateValueAndValidity();
          }
          this.toggleSubmitButtonAndForm();
          this.snackBar.open(
            'Registration failed: ' + err.error.message,
            'Close',
            { duration: 3000 }
          );
        },
      });
    }
  }
}
