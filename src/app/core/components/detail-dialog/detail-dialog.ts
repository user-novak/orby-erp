import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DetailDialogData } from '../../models/global';

@Component({
  selector: 'app-detail-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule],
  templateUrl: './detail-dialog.html',
  styleUrl: './detail-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailDialog {
  readonly data = inject<DetailDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DetailDialog>);

  close(): void {
    this.dialogRef.close();
  }
}
