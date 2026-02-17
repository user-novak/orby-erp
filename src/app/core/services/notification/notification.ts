import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSnackbar } from '../../components/notification-snackbar/notification-snackbar';
import { NotificationData } from '../../models/global';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  show(data: NotificationData, duration = 4000): void {
    this.snackBar.openFromComponent(NotificationSnackbar, {
      data,
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification-panel'],
    });
  }
}
