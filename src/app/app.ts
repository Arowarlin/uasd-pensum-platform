import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    @if (auth.isLoggedIn) {
      <nav class="navbar">
        <a class="brand" routerLink="/home">
          <div class="brand-logo">U</div>
          <div class="brand-text">
            <span class="brand-name">UASD <strong>Pensum</strong></span>
            <span class="brand-sub">Sistema Académico</span>
          </div>
        </a>
        <ul class="nav-links">
          <li><a routerLink="/home"               routerLinkActive="active">🏠 Inicio</a></li>
          <li><a routerLink="/carreras"            routerLinkActive="active">🏫 Carreras</a></li>
          <li><a routerLink="/pensum/informatica"  routerLinkActive="active">📋 Pensum</a></li>
          <li><a routerLink="/calculadora"         routerLinkActive="active">🧮 Calculadora</a></li>
          @if (auth.isAdmin) {
            <li><a routerLink="/admin" routerLinkActive="active" class="admin-link">🛠️ Admin</a></li>
          }
        </ul>
        <div class="user-menu">
          <div class="user-avatar">{{ auth.usuario?.avatar || 'U' }}</div>
          <div class="user-info">
            <span class="user-name">{{ (auth.usuario?.nombre ?? '').split(' ')[0] }}</span>
            <span class="user-role" [class]="auth.usuario?.role">
              {{ auth.isAdmin ? '🔑 Admin' : '🎓 Estudiante' }}
            </span>
          </div>
          <button class="btn-logout" (click)="logout()" title="Cerrar sesion">⏏</button>
        </div>
      </nav>
    }

    <main [class.with-nav]="auth.isLoggedIn">
      <router-outlet />
    </main>

    @if (auth.isLoggedIn) {
      <footer class="footer">
        <div class="footer-inner">
          <p class="footer-main">Universidad Autonoma de Santo Domingo — Primada de America © 2026</p>
          <p class="footer-autor">
            Desarrollado por: <strong>Arowarlin Suarez Diaz</strong>
            &nbsp;|&nbsp; Ingenieria de Software II
            &nbsp;|&nbsp; Prof. Natanael Geronimo Mena
          </p>
        </div>
      </footer>
    }
  `,
  styles: [`
    * { box-sizing: border-box; }

    .navbar {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0 1.5rem; height: 64px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.5);
      position: sticky; top: 0; z-index: 1000;
    }
    .brand {
      color: white; text-decoration: none;
      display: flex; align-items: center; gap: 10px; min-width: 170px;
    }
    .brand-logo {
      width: 38px; height: 38px; flex-shrink: 0;
      background: linear-gradient(135deg, #3182ce, #63b3ed);
      border-radius: 10px; display: flex; align-items: center;
      justify-content: center; font-weight: 900; font-size: 1.2rem;
      box-shadow: 0 3px 10px rgba(49,130,206,0.4);
    }
    .brand-text { display: flex; flex-direction: column; line-height: 1.2; }
    .brand-name { font-size: 0.95rem; font-weight: 700; }
    .brand-name strong { font-weight: 900; }
    .brand-sub { font-size: 0.62rem; opacity: 0.55; text-transform: uppercase; letter-spacing: 1px; }

    .nav-links {
      flex: 1; list-style: none; display: flex; gap: 2px; margin: 0; padding: 0;
    }
    .nav-links a {
      color: rgba(255,255,255,0.72); text-decoration: none;
      padding: 7px 12px; border-radius: 8px;
      font-size: 0.83rem; transition: all 0.18s; white-space: nowrap;
    }
    .nav-links a:hover  { background: rgba(255,255,255,0.1); color: white; }
    .nav-links a.active { background: rgba(255,255,255,0.17); color: white; font-weight: 600; }
    .admin-link { color: #f6e05e !important; }
    .admin-link:hover  { background: rgba(246,224,94,0.15) !important; }
    .admin-link.active { background: rgba(246,224,94,0.18) !important; }

    .user-menu {
      display: flex; align-items: center; gap: 0.6rem; margin-left: auto;
      padding-left: 1rem; border-left: 1px solid rgba(255,255,255,0.1);
    }
    .user-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, #2b6cb0, #63b3ed);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; color: white; font-size: 0.88rem;
      border: 2px solid rgba(255,255,255,0.2);
    }
    .user-info { display: flex; flex-direction: column; line-height: 1.2; }
    .user-name { font-size: 0.82rem; color: white; font-weight: 600; }
    .user-role { font-size: 0.68rem; }
    .user-role.admin     { color: #f6e05e; }
    .user-role.estudiante { color: #68d391; }
    .btn-logout {
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13);
      color: rgba(255,255,255,0.65); cursor: pointer; padding: 6px 10px;
      border-radius: 7px; font-size: 1rem; transition: all 0.18s; margin-left: 2px;
    }
    .btn-logout:hover { background: #e53e3e; color: white; border-color: #e53e3e; }

    main.with-nav { min-height: calc(100vh - 130px); }

    .footer {
      background: #0a0f1e; border-top: 1px solid rgba(255,255,255,0.06);
      padding: 1rem 1.5rem; text-align: center;
    }
    .footer-main  { font-size: 0.78rem; color: rgba(255,255,255,0.45); margin: 0 0 3px; }
    .footer-autor { font-size: 0.7rem;  color: rgba(255,255,255,0.28); margin: 0; }
    .footer-autor strong { color: rgba(255,255,255,0.55); }

    @media(max-width: 768px) {
      .nav-links  { display: none; }
      .user-info  { display: none; }
      .brand-sub  { display: none; }
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}