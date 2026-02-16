import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientFormValues } from '../models/client';

@Component({
  selector: 'app-client-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
})
export class ClientForm {
  @Output() formSubmit = new EventEmitter<ClientFormValues>();

  clientForm: FormGroup;

  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.clientForm = this.setClientForm();
  }

  onSubmitForm(): void {
    if (this.clientForm.invalid) {
      console.error('Formulario inválido');
      return;
    }
    this.formSubmit.emit(this.getClientFormValues());
  }

  onClearForm(): void {
    this.resetForm();
  }

  private getClientFormValues(): ClientFormValues {
    return this.clientForm.getRawValue();
  }

  private setClientForm(): FormGroup {
    return this._fb.group({
      name: ['', [Validators.required]],
      dni: [''],
      ruc: [''],
      phone: [''],
      address: [''],
    });
  }

  private resetForm(): void {
    this.clientForm.reset();
  }
}
