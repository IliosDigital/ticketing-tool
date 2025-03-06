import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    showLoginForm: boolean = true; 
    constructor(
      private router: Router,
      private userService: UserService,
      private snackBar: MatSnackBar
    ) {} 
    onSubmit(): void {
      if (!this.email || !this.password) {
        this.snackBar.open('Please enter both email and password!','Close',{
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return; 
      } 
      this.userService.loginUser(this.email, this.password).subscribe(
        (response) => {
          console.log('Login successful:', response);
  
          if (response && response.name) {
            localStorage.setItem('userName', response.name); 
            console.log('Stored userName:', response.name);
          } else {
            console.warn('Login successful, but no email found in response.');
          }  
          this.snackBar.open('Login Successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });     
          if (response.level === 'Team Lead' || response.level === 'Team Head') {
            this.router.navigate(['/headlogin']);
          } else {
            this.router.navigate(['/emplogin']);
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.snackBar.open(
            'Login Failed. Please check your credentials!',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
    }
  }
