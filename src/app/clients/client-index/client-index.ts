import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { Client, ClientExcel } from '../models/client';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { clientColumHeader } from '../constants/client';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientExcelMapper } from '../mappers/client-excel';

@Component({
  selector: 'app-client-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './client-index.html',
  styleUrl: './client-index.css',
})
export class ClientIndex {
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);

  clientColumHeader = clientColumHeader;

  ELEMENT_DATA: Client[] = [];

  dataSource = new MatTableDataSource<Client>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.excelService
      .importExcel<ClientExcel>(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          const clients: Client[] = rows.map((rawRow) => {
            const excelRow = ClientExcelMapper.normalizeExcelRow(rawRow);
            return ClientExcelMapper.toClient(excelRow);
          });

          console.log(clients);
        },
        error: (err) => {
          console.error('Error al importar Excel', err);
        },
      });
  }
}
