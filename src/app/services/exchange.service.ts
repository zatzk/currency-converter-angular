import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, shareReplay, switchMap, take, timer } from 'rxjs';

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})


export class ExchangeService {
  private apiUrl = environment.apiUrl;
  cache$!: Observable<any>;


  constructor(private http: HttpClient) {
  }

  getExchangeRate(){
    if(!this.cache$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.cache$ = timer$.pipe(
        switchMap((_) => this.requestExchangeRate().pipe(take(1))),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cache$;
  }

  requestExchangeRate(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

}
