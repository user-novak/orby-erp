import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModuleHeader } from '../core/components/module-header/module-header';

@Component({
  selector: 'app-accounts',
  imports: [ModuleHeader, RouterOutlet],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {}
