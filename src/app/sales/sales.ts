import { Component } from '@angular/core';
import { ModuleHeader } from '../core/components/module-header/module-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sales',
  imports: [ModuleHeader, RouterOutlet],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class Sales {}
