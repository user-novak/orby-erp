import { Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SOL_PREFIX } from '../../core/constants/global';

@Component({
  selector: 'app-cash-flow-movement',
  providers: [...provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './cash-flow-movement.html',
})
export class CashFlowMovement {
  readonly SOL_PREFIX = SOL_PREFIX;
  readonly accountNames: string[] = ['Caja principal', 'Banco BCP', 'Caja secundaria'];
}
