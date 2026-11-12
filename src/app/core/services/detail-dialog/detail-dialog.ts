import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailDialog } from '../../components/detail-dialog/detail-dialog';
import { DetailDialogData } from '../../models/global';

@Injectable({ providedIn: 'root' })
export class DetailDialogService {
  private readonly dialog = inject(MatDialog);

  open(data: DetailDialogData): void {
    this.dialog.open(DetailDialog, {
      data,
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });
  }
}
