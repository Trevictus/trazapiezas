import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ConfirmationModalComponent],
  templateUrl: './app.html'
})
export class App { }