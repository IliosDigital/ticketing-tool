import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { UserService } from '../user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: string = '';
  role: string = '';
  email: string = '';
  createPassword: string = '';
  confirmPassword: string = '';
  level: string = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar 
  ) {}
  onSubmit() {
    if (this.createPassword !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }
    if (
      this.name &&
      this.role &&
      this.email &&
      this.createPassword &&
      this.level
    ) {
      this.userService
        .registerUser(
          this.name,
          this.role,
          this.email,
          this.createPassword,
          this.level
        )
        .subscribe(
          (response) => {
            this.snackBar.open('Registration Successful!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });

            this.router.navigate(['/login']);
          },
          (error) => {
            this.snackBar.open('Registration Failed. Try again!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            console.error('Registration failed:', error);
          }
        );
    } else {
      this.snackBar.open('Please fill in all fields.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
