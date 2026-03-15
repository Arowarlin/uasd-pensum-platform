import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'carreras',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/carreras/carreras.component').then(m => m.CarrerasComponent)
  },
  {
    path: 'pensum/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/pensum/pensum.component').then(m => m.PensumComponent)
  },
  {
    path: 'calculadora',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/calculadora/calculadora.component').then(m => m.CalculadoraComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  { path: '**', redirectTo: 'login' }
];