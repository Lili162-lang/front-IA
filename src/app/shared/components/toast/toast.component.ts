// import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Subscription } from 'rxjs';
// import { ToastService, Toast } from '../../services/toast.service';

// @Component({
//   selector: 'app-toast',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="toast-container">
//       <div
//         *ngFor="let toast of toasts; trackBy: trackByFn"
//         class="toast"
//         [ngClass]="'toast-' + toast.type"
//         [@slideIn]
//       >
//         <div class="toast-icon">
//           <svg *ngIf="toast.type === 'success'" viewBox="0 0 20 20" fill="currentColor">
//             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
//           </svg>
//           <svg *ngIf="toast.type === 'error'" viewBox="0 0 20 20" fill="currentColor">
//             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
//           </svg>
//           <svg *ngIf="toast.type === 'warning'" viewBox="0 0 20 20" fill="currentColor">
//             <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
//           </svg>
//           <svg *ngIf="toast.type === 'info'" viewBox="0 0 20 20" fill="currentColor">
//             <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
//           </svg>
//         </div>
//         <div class="toast-content">
//           <div class="toast-title" *ngIf="toast.title">{{ toast.title }}</div>
//           <div class="toast-message">{{ toast.message }}</div>
//         </div>
//         <button
//           class="toast-close"
//           (click)="removeToast(toast.id)"
//           aria-label="Cerrar notificación"
//         >
//           <svg viewBox="0 0 20 20" fill="currentColor">
//             <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .toast-container {
//       position: fixed;
//       top: 1rem;
//       right: 1rem;
//       z-index: 1000;
//       display: flex;
//       flex-direction: column;
//       gap: 0.75rem;
//       max-width: 400px;
//     }

//     .toast {
//       display: flex;
//       align-items: flex-start;
//       gap: 0.75rem;
//       padding: 1rem;
//       background: white;
//       border-radius: 0.75rem;
//       box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
//       border-left: 4px solid;
//       animation: slideIn 0.3s ease-out;
//     }

//     .toast-success {
//       border-left-color: #10b981;
//     }

//     .toast-error {
//       border-left-color: #ef4444;
//     }

//     .toast-warning {
//       border-left-color: #f59e0b;
//     }

//     .toast-info {
//       border-left-color: #3b82f6;
//     }

//     .toast-icon {
//       flex-shrink: 0;
//       width: 1.25rem;
//       height: 1.25rem;
//       margin-top: 0.125rem;
//     }

//     .toast-success .toast-icon {
//       color: #10b981;
//     }

//     .toast-error .toast-icon {
//       color: #ef4444;
//     }

//     .toast-warning .toast-icon {
//       color: #f59e0b;
//     }

//     .toast-info .toast-icon {
//       color: #3b82f6;
//     }

//     .toast-content {
//       flex: 1;
//       min-width: 0;
//     }

//     .toast-title {
//       font-weight: 600;
//       color: #1f2937;
//       margin-bottom: 0.25rem;
//       font-size: 0.875rem;
//     }

//     .toast-message {
//       color: #6b7280;
//       font-size: 0.875rem;
//       line-height: 1.4;
//     }

//     .toast-close {
//       flex-shrink: 0;
//       width: 1.25rem;
//       height: 1.25rem;
//       color: #9ca3af;
//       background: none;
//       border: none;
//       cursor: pointer;
//       padding: 0;
//       transition: color 0.2s ease;
//     }

//     .toast-close:hover {
//       color: #6b7280;
//     }

//     @keyframes slideIn {
//       from {
//         transform: translateX(100%);
//         opacity: 0;
//       }
//       to {
//         transform: translateX(0);
//         opacity: 1;
//       }
//     }

//     @media (max-width: 640px) {
//       .toast-container {
//         left: 1rem;
//         right: 1rem;
//         max-width: none;
//       }
//     }
//   `]
// })
// export class ToastComponent implements OnInit, OnDestroy {
//   toasts: Toast[] = [];
//   private subscription?: Subscription;

//   constructor(private toastService: ToastService) {}

//   ngOnInit(): void {
//     this.subscription = this.toastService.toasts$.subscribe(
//       (toasts: Toast[]) => this.toasts = toasts
//     );
//   }

//   ngOnDestroy(): void {
//     this.subscription?.unsubscribe();
//   }

//   removeToast(id: string): void {
//     this.toastService.remove(id);
//   }

//   trackByFn(index: number, toast: Toast): string {
//     return toast.id;
//   }
// }
