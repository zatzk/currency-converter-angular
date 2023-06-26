import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class ExchangeService {
  private apiUrl = environment.apiUrl + environment.apiKey;

  constructor(private http: HttpClient) {
  }

  getExchangeRate(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


}
