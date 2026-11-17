import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModuleHeader } from '../core/components/module-header/module-header';

@Component({
  selector: 'app-categories',
  imports: [ModuleHeader, RouterOutlet],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {}
