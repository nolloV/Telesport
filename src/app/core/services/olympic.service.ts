import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | undefined>(undefined); //stocke et émet les données olympiques.

  constructor(private http: HttpClient) {} //permet les requêtes HTTP.

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe( //Effectue une requête GET pour obtenir les données 
      tap((value) => this.olympics$.next(value)), //Met à jour olympics$ avec les données reçues.
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error('An error occurred:', error);
        // can be useful to end loading state and let the user know something went wrong
        alert('An error occurred while loading the data. Please try again later.');
        this.olympics$.next(undefined);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
