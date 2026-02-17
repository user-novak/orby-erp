import { inject, Injectable } from '@angular/core';
import { ConfirmDialogData, ConfirmDialogResult } from '../../models/global';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  open(data: ConfirmDialogData): Observable<ConfirmDialogResult | undefined> {
    return this.dialog.open(ConfirmDialog, { data }).afterClosed();
  }
}
