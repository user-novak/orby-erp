import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModuleHeader } from '../core/components/module-header/module-header';

@Component({
  selector: 'app-cash-flow',
  imports: [ModuleHeader, RouterOutlet],
  templateUrl: './cash-flow.html',
  styleUrl: './cash-flow.css',
})
export class CashFlow {

}
