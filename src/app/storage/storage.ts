import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { StorageItem } from './models/storage';

@Component({
  selector: 'app-storage',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './storage.html',
  styleUrl: './storage.css',
})
export class Storage implements AfterViewInit {
  displayedColumns: string[] = [
    'code',
    'description',
    'brand',
    'measure',
    'unit_price',
    'general_price',
    'stock',
    'actions',
  ];

  ELEMENT_DATA: StorageItem[] = [
    {
      code: 'PRD-001',
      description: 'Mouse inalámbrico',
      brand: 'Logitech',
      measure: 'unidad',
      unit_price: 25.9,
      general_price: 25.9,
      stock: 120,
    },
    {
      code: 'PRD-002',
      description: 'Teclado mecánico',
      brand: 'Redragon',
      measure: 'unidad',
      unit_price: 65.5,
      general_price: 65.5,
      stock: 80,
    },
    {
      code: 'PRD-003',
      description: 'Monitor LED 24"',
      brand: 'Samsung',
      measure: 'unidad',
      unit_price: 140.0,
      general_price: 140.0,
      stock: 45,
    },
    {
      code: 'PRD-004',
      description: 'Cable HDMI 2.0',
      brand: 'Belkin',
      measure: 'unidad',
      unit_price: 8.5,
      general_price: 8.5,
      stock: 300,
    },
    {
      code: 'PRD-005',
      description: 'Disco duro externo 1TB',
      brand: 'Western Digital',
      measure: 'unidad',
      unit_price: 59.99,
      general_price: 59.99,
      stock: 62,
    },
    {
      code: 'PRD-006',
      description: 'Memoria USB 32GB',
      brand: 'Kingston',
      measure: 'unidad',
      unit_price: 9.99,
      general_price: 9.99,
      stock: 500,
    },
    {
      code: 'PRD-007',
      description: 'Laptop Core i5 16GB RAM',
      brand: 'Lenovo',
      measure: 'unidad',
      unit_price: 799.0,
      general_price: 799.0,
      stock: 20,
    },
    {
      code: 'PRD-008',
      description: 'Router WiFi 6',
      brand: 'TP-Link',
      measure: 'unidad',
      unit_price: 120.0,
      general_price: 120.0,
      stock: 75,
    },
    {
      code: 'PRD-009',
      description: 'Audífonos over-ear',
      brand: 'Sony',
      measure: 'unidad',
      unit_price: 45.0,
      general_price: 45.0,
      stock: 150,
    },
    {
      code: 'PRD-010',
      description: 'Webcam Full HD',
      brand: 'Microsoft',
      measure: 'unidad',
      unit_price: 39.9,
      general_price: 39.9,
      stock: 110,
    },
    {
      code: 'PRD-011',
      description: 'Silla ergonómica de oficina',
      brand: 'ErgoPlus',
      measure: 'unidad',
      unit_price: 189.0,
      general_price: 189.0,
      stock: 30,
    },
    {
      code: 'PRD-012',
      description: 'SSD NVMe 512GB',
      brand: 'Crucial',
      measure: 'unidad',
      unit_price: 52.9,
      general_price: 52.9,
      stock: 90,
    },
    {
      code: 'PRD-013',
      description: 'Impresora multifuncional',
      brand: 'HP',
      measure: 'unidad',
      unit_price: 210.0,
      general_price: 210.0,
      stock: 25,
    },
    {
      code: 'PRD-014',
      description: 'Cargador USB-C 65W',
      brand: 'Anker',
      measure: 'unidad',
      unit_price: 29.99,
      general_price: 29.99,
      stock: 200,
    },
    {
      code: 'PRD-015',
      description: 'Tableta gráfica pequeña',
      brand: 'Wacom',
      measure: 'unidad',
      unit_price: 89.0,
      general_price: 89.0,
      stock: 40,
    },
    {
      code: 'PRD-016',
      description: 'Parlantes 2.1',
      brand: 'Creative',
      measure: 'unidad',
      unit_price: 54.9,
      general_price: 54.9,
      stock: 70,
    },
    {
      code: 'PRD-017',
      description: 'Hub USB 3.0 4 puertos',
      brand: 'Ugreen',
      measure: 'unidad',
      unit_price: 12.9,
      general_price: 12.9,
      stock: 260,
    },
    {
      code: 'PRD-018',
      description: 'Alfombrilla gamer XL',
      brand: 'Razer',
      measure: 'unidad',
      unit_price: 19.99,
      general_price: 19.99,
      stock: 150,
    },
    {
      code: 'PRD-019',
      description: 'Caja registradora electrónica',
      brand: 'Sharp',
      measure: 'unidad',
      unit_price: 350.0,
      general_price: 350.0,
      stock: 10,
    },
    {
      code: 'PRD-020',
      description: 'Proyector portátil LED',
      brand: 'Xiaomi',
      measure: 'unidad',
      unit_price: 260.0,
      general_price: 260.0,
      stock: 15,
    },
  ];
  dataSource = new MatTableDataSource<StorageItem>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly router = inject(Router);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
