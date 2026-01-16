import { Component, ViewChild } from '@angular/core';
import { Client } from '../models/client';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { clientColumHeader } from '../constants/client';

@Component({
  selector: 'app-client-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './client-index.html',
  styleUrl: './client-index.css',
})
export class ClientIndex {
  clientColumHeader = clientColumHeader;

  ELEMENT_DATA: Client[] = [];

  dataSource = new MatTableDataSource<Client>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onFileSelected(event: Event): void {
    console.log(event);
  }
}
