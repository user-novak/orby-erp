import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-data',
  imports: [MatIconModule],
  templateUrl: './no-data.html',
  styleUrl: './no-data.css',
})
export class NoData {
  @Input() message: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
}
