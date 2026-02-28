import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Client, ClientFormValues } from '../models/client';

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
  readonly client = input<Client | null>(null);

  @Output() formSubmit = new EventEmitter<ClientFormValues>();

  clientForm: FormGroup;

  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.clientForm = this.setClientForm();

    effect(() => {
      const clientValue = this.client();
      if (clientValue) {
        this.patchFormValues(clientValue);
      }
    });
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

  private patchFormValues(client: Client): void {
    this.clientForm.patchValue(client);
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
