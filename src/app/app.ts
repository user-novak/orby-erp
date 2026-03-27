import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './core/components/loader/loader';
import { LoaderService } from './core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('orby-erp');
  isLoading = signal(false);

  constructor(private loaderService: LoaderService) {
    this.loaderService.loading$.subscribe((value) => {
      this.isLoading.set(value);
    });
  }
}
