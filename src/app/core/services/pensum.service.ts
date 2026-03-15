import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrera } from '../models/pensum.models';

@Injectable({ providedIn: 'root' })
export class PensumService {
  constructor(private http: HttpClient) {}

  getCarrera(id: string): Observable<Carrera> {
    return this.http.get<Carrera>(`assets/data/${id}.json`);
  }
}
