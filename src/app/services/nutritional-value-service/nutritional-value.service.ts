import {BehaviorSubject} from "rxjs";
import {ApiService} from "../api-service/api-service";
import {Injectable} from "@angular/core";
import {NutritionalValue} from "../../models/nutritional-value";

@Injectable({
  providedIn: 'root'
})
export class NutritionalValueService {
  private maxNutritionalValueSubject =  new BehaviorSubject<NutritionalValue>(new NutritionalValue());
  maxNutritionalValue$ = this.maxNutritionalValueSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getMaxNutritionalValues(id: string) {
  }
}
