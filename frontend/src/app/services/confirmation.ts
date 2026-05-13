import { Injectable, signal } from '@angular/core';

export interface ConfirmationDialog {
  id: string;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'info' | 'warning' | 'error';
  onConfirm: () => void;
  onCancel: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  dialogs = signal<ConfirmationDialog[]>([]);

  confirm(
    message: string,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      severity?: 'info' | 'warning' | 'error';
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const id = Date.now().toString();

      const dialog: ConfirmationDialog = {
        id,
        message,
        title: options?.title || 'Confirmación',
        confirmText: options?.confirmText || 'Confirmar',
        cancelText: options?.cancelText || 'Cancelar',
        severity: options?.severity || 'info',
        onConfirm: () => {
          this.remove(id);
          resolve(true);
        },
        onCancel: () => {
          this.remove(id);
          resolve(false);
        }
      };

      this.dialogs.update(dialogs => [...dialogs, dialog]);
    });
  }

  remove(id: string): void {
    this.dialogs.update(dialogs => dialogs.filter(d => d.id !== id));
  }
}
