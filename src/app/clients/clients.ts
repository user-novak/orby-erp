import { Component } from '@angular/core';
import { ModuleHeader } from "../core/components/module-header/module-header";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-clients',
  imports: [ModuleHeader, RouterOutlet],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients {

}
