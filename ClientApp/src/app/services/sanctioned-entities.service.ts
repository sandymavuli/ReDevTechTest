import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SanctionedEntity } from '../models/sanctioned-entity';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SanctionedEntitiesService {
  private readonly apiUrl: string;
  private readonly path = 'sanctioned-entities';

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.apiUrl = baseUrl + 'api/';
  }

  public getSanctionedEntities(): Observable<SanctionedEntity[]> {
    const url = this.apiUrl + this.path;
    return this.http.get<SanctionedEntity[]>(url);
  }

  // POST method to add a new entity
  public addSanctionedEntity(
    entity: SanctionedEntity
  ): Observable<SanctionedEntity> {
    const url = this.apiUrl + this.path;
    return this.http.post<SanctionedEntity>(url, entity).pipe(
      catchError((error) => {
        console.error('Error adding sanctioned entity:', error);
        //We can use angular material snackbar or something to show error to user in nice way To Do
        return throwError(() => error);
      })
    );
  }
}
