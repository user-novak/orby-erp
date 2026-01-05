import { Component } from '@angular/core';
import { StorageForm } from '../storage-form/storage-form';

@Component({
  selector: 'app-storage-create',
  imports: [StorageForm],
  templateUrl: './storage-create.html',
  styleUrl: './storage-create.css',
})
export class StorageCreate {}
