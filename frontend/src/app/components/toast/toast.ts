import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 space-y-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          [ngClass]="getToastClasses(toast.type)"
          class="flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div [ngClass]="getIconClasses(toast.type)">
            @if (toast.type === 'success') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            }
            @if (toast.type === 'error') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            }
            @if (toast.type === 'info') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            }
          </div>
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button 
            (click)="toastService.remove(toast.id)"
            class="ml-2 hover:opacity-70 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in-from-bottom-4 {
      from {
        transform: translateY(16px);
      }
      to {
        transform: translateY(0);
      }
    }
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .animate-in {
      animation: slide-in-from-bottom-4 0.3s ease-out, fade-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getToastClasses(type: string): string {
    const baseClasses = 'text-sm font-medium';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-emerald-500/10 border-emerald-500/30 text-emerald-200`;
      case 'error':
        return `${baseClasses} bg-red-500/10 border-red-500/30 text-red-200`;
      case 'info':
        return `${baseClasses} bg-sky-500/10 border-sky-500/30 text-sky-200`;
      default:
        return baseClasses;
    }
  }

  getIconClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-emerald-400 flex-shrink-0';
      case 'error':
        return 'text-red-400 flex-shrink-0';
      case 'info':
        return 'text-sky-400 flex-shrink-0';
      default:
        return 'text-zinc-400 flex-shrink-0';
    }
  }
}
