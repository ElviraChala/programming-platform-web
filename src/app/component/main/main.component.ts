import {Component} from '@angular/core';
import {AuthService} from '../../service/AuthService';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  username: string = '';
  password: string = '';

  constructor(private readonly authService: AuthService) {
  }

  login() {
    let response = this.authService.login(this.username, this.password);
    console.log(response);
    response.subscribe({
      next: (res) => console.log('login success', res),
      error: (err) => console.error('login failed', err)
    });
  }

  registration() {
    let response = this.authService.register(this.username, this.password);
    console.log(response);
    response.subscribe({
      next: (res) => console.log('Registration success', res),
      error: (err) => console.error('Registration failed', err)
    });
  }
}
