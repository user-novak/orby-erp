import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StorageItem } from '../models/storage';
import { Router } from '@angular/router';
import { ELEMENT_DATA, storageColumHeader } from '../constants/storage';

@Component({
  selector: 'app-storage-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './storage-index.html',
  styleUrl: './storage-index.css',
})
export class StorageIndex implements AfterViewInit {
  private readonly router = inject(Router);

  storageColumHeader: string[] = storageColumHeader;

  ELEMENT_DATA: StorageItem[] = ELEMENT_DATA;

  dataSource = new MatTableDataSource<StorageItem>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  goToCreate() {
    this.router.navigateByUrl('/storage/create');
  }
}
