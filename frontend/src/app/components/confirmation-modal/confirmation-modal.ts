import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.html'
})
export class ConfirmationModalComponent {
  constructor(public confirmationService: ConfirmationService) { }
}
