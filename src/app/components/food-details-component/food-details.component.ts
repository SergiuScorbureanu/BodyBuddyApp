import {Component} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.scss'
})
export class FoodDetailsComponent {
  title: string | null = null;
  food: any;

  constructor(
    public modalRef: MdbModalRef<FoodDetailsComponent>
  ) {}
}
