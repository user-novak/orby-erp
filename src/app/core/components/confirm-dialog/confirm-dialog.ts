import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmDialogData, ConfirmDialogResult } from '../../models/global';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogTitle, MatDialogActions, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef<ConfirmDialog, ConfirmDialogResult>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  onAccept(): void {
    this.dialogRef.close('accept');
  }
}
