import { Component, Input } from '@angular/core';

@Component({
  selector: 'card-component',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() src: string;
  @Input() att?: number;
  @Input() def?: number;
  constructor() {}
}