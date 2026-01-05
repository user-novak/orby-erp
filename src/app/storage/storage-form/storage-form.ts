import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MESAURE_UNITS } from '../../core/constants/global';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-storage-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule],
  templateUrl: './storage-form.html',
  styleUrl: './storage-form.css',
})
export class StorageForm {
  mesaureUnities: string[] = MESAURE_UNITS;
  tempValues: string[] = ['Valor 1', 'Valor 2'];
}
