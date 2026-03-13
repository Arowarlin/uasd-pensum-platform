import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/home">
        <span class="logo">🎓</span> UASD Pensum
      </a>
      <ul>
        <li><a routerLink="/home"        routerLinkActive="active">Inicio</a></li>
        <li><a routerLink="/carreras"    routerLinkActive="active">Carreras</a></li>
        <li><a routerLink="/calculadora" routerLinkActive="active">Calculadora</a></li>
      </ul>
    </nav>
    <main class="main-content">
      <router-outlet />
    </main>
    <footer class="footer">
      <p>Universidad Autónoma de Santo Domingo — Primada de América © 2025</p>
    </footer>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1a365d 0%, #2a6496 100%);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem; height: 60px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      position: sticky; top: 0; z-index: 100;
    }
    .brand { color:#fff; font-size:1.15rem; font-weight:700; text-decoration:none; display:flex; align-items:center; gap:8px; }
    .logo { font-size:1.3rem; }
    ul { list-style:none; display:flex; gap:0.5rem; margin:0; padding:0; }
    ul a { color:rgba(255,255,255,0.85); text-decoration:none; padding:6px 14px; border-radius:6px; font-size:0.9rem; transition:background 0.2s; }
    ul a:hover, ul a.active { background:rgba(255,255,255,0.18); color:#fff; }
    .main-content { min-height:calc(100vh - 120px); }
    .footer { background:#1a202c; color:rgba(255,255,255,0.6); text-align:center; padding:1rem; font-size:0.82rem; }
  `]
})
export class AppComponent {}