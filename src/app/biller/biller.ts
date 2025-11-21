import { ChangeDetectionStrategy, Component, LOCALE_ID } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-biller',
  providers: [...provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './biller.html',
  styleUrl: './biller.css',
})
export class Biller {}
