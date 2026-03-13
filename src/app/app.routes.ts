import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'carreras',
    loadComponent: () => import('./features/carreras/carreras.component')
      .then(m => m.CarrerasComponent)
  },
  {
    path: 'pensum/:id',
    loadComponent: () => import('./features/pensum/pensum.component')
      .then(m => m.PensumComponent)
  },
  {
    path: 'calculadora',
    loadComponent: () => import('./features/calculadora/calculadora.component')
      .then(m => m.CalculadoraComponent)
  },
  { path: '**', redirectTo: 'home' }
];