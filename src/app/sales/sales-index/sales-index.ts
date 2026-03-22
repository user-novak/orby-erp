import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BillerService } from '../../biller/services/biller';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sales-index',
  imports: [],
  templateUrl: './sales-index.html',
  styleUrl: './sales-index.css',
})
export class SalesIndex implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly billerService = inject(BillerService);

  ngOnInit(): void {
    this.listSales();
  }

  private listSales() {
    this.billerService
      .getSales()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
      });
  }
}
