import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {map, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpMethodConstants} from "../../constants/http-method-constants";
import {NutritionalValue} from "../../models/nutritional-value";
import {Meal} from "../../models/meal";
import {Food} from "../../models/food";
import {DisplayMeal} from "../../models/display-meal";
import {User} from "../../models/user";
import {UserDetails} from "../../models/google-auth-classes/user-details";
import {Token} from "../../models/google-auth-classes/token";
import {StorageService} from "../storage-service/storage.service";

let _baseAddress = '';
let _http: HttpClient;
const _httpMethodConstants = new HttpMethodConstants();


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  nutritionalValues = getNutritionalValuesEndpoints();
  meals = getMealsEndpoints();
  foods = getFoodsEndpoints();
  users = getUsersEndpoints();

  token: string = "";
  private tokenKey = 'authToken';

  constructor(
    private http: HttpClient,
    private storageService: StorageService) {
    _http = this.http;
    _baseAddress = 'http://localhost:8080/bodybuddy/v1';
  }

  getAuth(url: string): any {
    return this.http.get(_baseAddress + url);
  }

  getPrivate(url: string): Observable<UserDetails> {
    const token: string | null = this.storageService.getToken();
    if (!token) {
      console.error('No JWT token found');
      return throwError(() => new Error('No JWT token found'));
    }
    return this.http.get<UserDetails>(_baseAddress + url, {
      headers: new HttpHeaders({"Authorization": "Bearer " + token})
    });
  }

  getToken(code: string): Observable<boolean> {
    const role = localStorage.getItem('authRole');
    return this.http.get<Token>(`http://localhost:8080/bodybuddy/v1/auth/callback?code=${code}&role=${role}`, { observe: "response" })
      .pipe(map((response: HttpResponse<Token>) => {
        if (response.status === 200 && response.body !== null) {
          this.token = response.body.token;
          localStorage.setItem(this.tokenKey, this.token);

          this.storageService.saveUser({
            id: response.body.id,
            username: response.body.username,
            accessToken: response.body.token,
            email: response.body.email,
            picture: response.body.picture,
            role: response.body.role,
          });
          this.setToken(response.body.token);

          return true;
        } else {
          return false;
        }
      }));
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = "";
    localStorage.removeItem(this.tokenKey);
  }
}
function getMealsEndpoints() {
  const controller = 'meals';
  return {
    getMealsByDate: getMealsByDate,
    createMeal: createMeal,
    countMeals: countMeals,
    deleteMeal: deleteMeal
  };

  function getMealsByDate(id: string, date: string): Observable<DisplayMeal[]> {
    return get<DisplayMeal[]>(buildURL(controller, [id, date]));
  }

  function createMeal(meal: Meal): Observable<Meal> {
    return post<Meal>(buildURL(controller), meal);
  }

  function countMeals(): Observable<number> {
    return get<number>(buildURL(controller));
  }

  function deleteMeal(id: string): Observable<void> {
    return del<void>(buildURL(controller, [id]));
  }
}

function getNutritionalValuesEndpoints() {
  const controller = 'nutritional-calculator';

  return {
    getMaxNutritionalValues: getMaxNutritionalValues,
  };

  function getMaxNutritionalValues(id: string): Observable<NutritionalValue> {
    return get<NutritionalValue>(buildURL(controller, [id]));
  }
}

function getFoodsEndpoints() {
  const controller = 'foods';

  return {
    getFoods: getFoods,
    createFood: createFood,
    updateFood: updateFood,
    deleteFood: deleteFood
  }

  function getFoods(): Observable<Food[]> {
    return get<Food[]>(buildURL(controller));
  }

  function createFood(food: Food): Observable<Food> {
    return post<Food>(buildURL(controller), food);
  }

  function updateFood(id: string, food: Food): Observable<Food> {
    return put<Food>(buildURL(controller, [id]), food);
  }

  function deleteFood(id: string): Observable<void> {
    return del<void>(buildURL(controller, [id]));
  }
}

function getUsersEndpoints() {
  const controller= 'users';
  return {
    getUsers: getUsers,
    deleteUser: deleteUser,
    updateUsername: updateUsername,
    updateEmail: updateEmail,
    updatePassword: updatePassword
  }

  function getUsers(): Observable<User[]> {
    return get<User[]>(buildURL(controller));
  }

  function deleteUser(id: string): Observable<void> {
    return del<void>(buildURL(controller, [id]));
  }

  function updateUsername(id: string, username: string): Observable<any> {
    return put(buildURL(controller, [id, 'username']), { username });
  }

  function updateEmail(id: string, email: string): Observable<any> {
    return put(buildURL(controller, [id, 'email']), { email });
  }

  function updatePassword(id: string, password: string): Observable<any> {
    return put(buildURL(controller, [id, 'password']), { password });
  }
}


function get<R>(url: string, responseType = 'json'): Observable<R> {
  return sendRequest(_httpMethodConstants.GET, url, responseType);
}

function post<R>(url: string, data?: any): Observable<R> {
  return sendRequest(_httpMethodConstants.POST, url, 'json', data);
}

function put<R>(url: string, data?: any): Observable<R> {
  return sendRequest(_httpMethodConstants.PUT, url, 'json', data);
}

function del<R>(url: string): Observable<R> {
  return sendRequest(_httpMethodConstants.DELETE, url, 'json');
}


function sendRequest<R>(method: string, url: string, responseType: string, data?: any): Observable<R> {
  let observableResponse: Observable<any>;
  const options = {
    headers: new HttpHeaders()
  };

  // @ts-ignore
  options['responseType'] = responseType;

  switch (method) {
    case _httpMethodConstants.GET:
      observableResponse = _http.get(url, options);
      break;
    case _httpMethodConstants.POST:
      observableResponse = _http.post(url, data, options);
      break;
    case _httpMethodConstants.PUT:
      observableResponse = _http.put(url, data, options);
      break;
    case _httpMethodConstants.DELETE:
      observableResponse = _http.delete(url, options);
      break;
    case _httpMethodConstants.PATCH:
      observableResponse = _http.patch(url, data, options);
  }

  // @ts-ignore
  return observableResponse;
}

function buildURL(controller: string, routeParams?: string[], queryParams ?: [string, string][]): string {
  let url: string = _baseAddress + '/' + controller;
  if (routeParams) {
    for (const routeParam of routeParams) {
      url += '/' + encodeURIComponent(routeParam);
    }
  }
  const queryParamsResult = buildQueryParams(queryParams);
  if (queryParamsResult) {
    url += '?' + queryParamsResult;
  }

  return encodeURI(url);
}

function buildQueryParams(queryParams?: [string, string][]): string {
  let queryParamsResult = '';
  if (queryParams && queryParams.length > 0) {
    queryParams.forEach((value, i) => {
      queryParamsResult += (value[0] + '=' + value[1]);
      if (i + 1 < queryParams.length) {
        queryParamsResult += '&&';
      }
    });
  }
  return queryParamsResult;
}
