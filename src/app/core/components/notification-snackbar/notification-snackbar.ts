import { Component, inject } from '@angular/core';
import { NotificationData } from '../../models/global';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
  MatSnackBarLabel,
  MatSnackBarActions,
  MatSnackBarAction,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-notification-snackbar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
  templateUrl: './notification-snackbar.html',
  styleUrl: './notification-snackbar.css',
})
export class NotificationSnackbar {
  readonly data = inject<NotificationData>(MAT_SNACK_BAR_DATA);
  readonly snackBarRef = inject(MatSnackBarRef<NotificationSnackbar>);

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
