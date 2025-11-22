import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../core/classess/ErrorStateMatcher';
import { SALES_TYPES } from './constants/fields';
import {Option} from '../core/models/global';

@Component({
  selector: 'app-biller',
  providers: [...provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './biller.html',
  styleUrl: './biller.css',
})
export class Biller {
  clients: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
  clientTypes: string[] = ['Tipo 1', 'Tipo 2'];
  saleTypes:  Option[] = SALES_TYPES;
  accounts: string[] = ['Entidad 1', 'Entidad 2'];
  mesaureUnities: string[] = ['kg', 'mg'];

  generalInfo: FormGroup;

  matcher = new MyErrorStateMatcher();

  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.generalInfo = this.setGeneralInfoForm();
  }

  private setGeneralInfoForm() {
    return this._fb.group({
      registerDate: ['', [Validators.required]],
      clientType: ['', [Validators.required]],
      client: ['', [Validators.required]],
      saleType: ['', [Validators.required]],
      account: ['', [Validators.required]],
      place: [''],
      paymentDate: [''],
    });
  }
}
