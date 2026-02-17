import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { Client, ClientExcel } from '../models/client';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { clientColumHeader } from '../constants/client';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientExcelMapper } from '../mappers/client-excel';
import { ClientService } from '../services/client';
import { ApiResponse, NotificationData } from '../../core/models/global';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../core/services/notification/notification';

@Component({
  selector: 'app-client-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './client-index.html',
  styleUrl: './client-index.css',
})
export class ClientIndex implements OnInit {
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);

  clientColumHeader = clientColumHeader;

  dataSource = new MatTableDataSource<Client>([]);

  private readonly clientService: ClientService = inject(ClientService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.listClients();
  }

  goToCreate() {
    this.router.navigateByUrl('/clients/create');
  }

  confirmDelete(clientID: number) {
    this.confirmDialogService
      .open({
        message: '¿Deseas eliminar este cliente?',
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result === 'accept') {
          this.deleteClient(clientID);
        }
      });
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

          this.saveClientsBulk(clients);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al importar archivo Excel', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private listClients() {
    this.clientService
      .getClients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Client[]>) => {
          this.dataSource.data = response.data;

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          this.showNotification(
            this.generateNotification('Clientes cargados exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar clientes', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private deleteClient(clientID: number) {
    this.clientService
      .deleteClient(clientID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.listClients();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al eliminar cliente', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private saveClientsBulk(clients: Client[]): void {
    this.clientService
      .createBulk(clients)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.listClients();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al guardar clientes', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private generateNotification(
    message: string,
    icon: string,
    backgroundColor: string,
  ): NotificationData {
    return {
      message,
      icon,
      backgroundColor,
    };
  }

  private showNotification(notification: NotificationData, duration?: number) {
    this.notification.show(notification, duration);
  }
}
