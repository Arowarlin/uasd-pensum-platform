import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="home-wrap">

      <div class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-badge">🎓 Sistema Academico Digital</div>
          <h1>
            Bienvenido,
            <span class="hero-name">{{ (auth.usuario?.nombre ?? '').split(' ')[0] }}</span>
          </h1>
          <p class="hero-sub">
            Plataforma de gestion de pensum de la
            <strong>Universidad Autonoma de Santo Domingo</strong>
          </p>
          <div class="hero-actions">
            <a routerLink="/pensum/informatica" class="hbtn primary">📋 Ver Pensum</a>
            <a routerLink="/carreras"           class="hbtn sec">🏫 Carreras</a>
            @if (auth.isAdmin) {
              <a routerLink="/admin" class="hbtn adm">🛠️ Admin Panel</a>
            }
          </div>
        </div>
      </div>

      <div class="stats-strip">
        <div class="ss-item">
          <span class="ss-val">1</span>
          <span class="ss-lbl">Carrera disponible</span>
        </div>
        <div class="ss-div"></div>
        <div class="ss-item">
          <span class="ss-val">186</span>
          <span class="ss-lbl">Creditos totales</span>
        </div>
        <div class="ss-div"></div>
        <div class="ss-item">
          <span class="ss-val">9</span>
          <span class="ss-lbl">Semestres</span>
        </div>
        <div class="ss-div"></div>
        <div class="ss-item">
          <span class="ss-val">55</span>
          <span class="ss-lbl">Asignaturas</span>
        </div>
      </div>

      <div class="modules-grid">

        <a routerLink="/pensum/informatica" class="mod-card featured">
          <div class="mod-icon">📋</div>
          <h3>Pensum Informatica</h3>
          <p>Consulta el plan de estudios completo de Licenciatura en Informatica. 9 semestres, 186 creditos.</p>
          <span class="mod-link">Ver pensum →</span>
          <span class="mod-badge">Plan 200820</span>
        </a>

        <a routerLink="/carreras" class="mod-card">
          <div class="mod-icon">🏫</div>
          <h3>Carreras UASD</h3>
          <p>Explora las carreras disponibles en el sistema con sus detalles academicos.</p>
          <span class="mod-link">Ver carreras →</span>
        </a>

        <a routerLink="/calculadora" class="mod-card">
          <div class="mod-icon">🧮</div>
          <h3>Calculadora de Horas</h3>
          <p>Calcula horas teoricas, practicas y virtuales segun la modalidad de la carrera.</p>
          <span class="mod-link">Abrir calculadora →</span>
        </a>

        @if (auth.isAdmin) {
          <a routerLink="/admin" class="mod-card admin-card">
            <div class="mod-icon">🛠️</div>
            <h3>Panel Administrativo</h3>
            <p>Gestion de usuarios, carreras y configuracion del sistema. Solo administradores.</p>
            <span class="mod-link">Abrir panel →</span>
            <span class="mod-badge admin">ADMIN</span>
          </a>
        }

      </div>

      <div class="info-card">
        <div class="info-icon">📘</div>
        <div>
          <h4>Licenciatura en Informatica — Plan 200820</h4>
          <p>Facultad de Ciencias · Escuela de Informatica · Codigo 40601-INFO · 186 creditos · 9 semestres · Modalidad presencial</p>
        </div>
        <a routerLink="/pensum/informatica" class="info-btn">Ver Pensum →</a>
      </div>

    </div>
  `,
  styles: [`
    .home-wrap { max-width: 1100px; margin: 0 auto; padding: 0 0 3rem; }

    .hero {
      position: relative; overflow: hidden;
      background: linear-gradient(135deg, #050d1a 0%, #0f2040 50%, #1a3a6f 100%);
      padding: 3.5rem 3rem; color: white; margin-bottom: 0;
    }
    .hero-bg {
      position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse at 70% 50%, rgba(49,130,206,0.15) 0%, transparent 60%);
    }
    .hero-content { position: relative; z-index: 1; }
    .hero-badge {
      display: inline-block; background: rgba(99,179,237,0.2); border: 1px solid rgba(99,179,237,0.35);
      color: #90cdf4; padding: 5px 14px; border-radius: 20px;
      font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem;
    }
    h1 { font-size: 2.2rem; font-weight: 900; margin: 0 0 0.6rem; }
    .hero-name { color: #63b3ed; }
    .hero-sub { font-size: 0.95rem; opacity: 0.8; margin: 0 0 1.8rem; max-width: 500px; }
    .hero-actions { display: flex; gap: 0.7rem; flex-wrap: wrap; }
    .hbtn { padding: 11px 22px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 0.88rem; transition: all 0.2s; }
    .hbtn.primary { background: #3182ce; color: white; box-shadow: 0 4px 15px rgba(49,130,206,0.4); }
    .hbtn.primary:hover { background: #2b6cb0; transform: translateY(-2px); }
    .hbtn.sec { background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2); }
    .hbtn.sec:hover { background: rgba(255,255,255,0.2); }
    .hbtn.adm { background: rgba(246,224,94,0.15); color: #f6e05e; border: 1px solid rgba(246,224,94,0.3); }
    .hbtn.adm:hover { background: rgba(246,224,94,0.25); }

    .stats-strip {
      background: #1a365d; display: flex; align-items: center;
      padding: 0; flex-wrap: wrap;
    }
    .ss-item { flex: 1; padding: 18px 20px; text-align: center; min-width: 100px; }
    .ss-val { display: block; font-size: 1.8rem; font-weight: 900; color: #63b3ed; }
    .ss-lbl { display: block; font-size: 0.65rem; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-top: 2px; }
    .ss-div { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

    .modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1.2rem; padding: 2rem 2rem 0; }
    .mod-card {
      background: white; border-radius: 14px; padding: 1.5rem;
      text-decoration: none; color: inherit;
      box-shadow: 0 3px 15px rgba(0,0,0,0.08);
      transition: all 0.22s; display: flex; flex-direction: column; gap: 6px;
      border: 2px solid transparent; position: relative; overflow: hidden;
    }
    .mod-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.13); border-color: #3182ce; }
    .mod-card.featured { border-color: #3182ce; background: linear-gradient(135deg, #eff6ff, white); }
    .mod-card.admin-card { border-color: #f6e05e; background: linear-gradient(135deg, #fffff0, white); }
    .mod-icon { font-size: 2rem; margin-bottom: 4px; }
    .mod-card h3 { margin: 0; font-size: 1rem; font-weight: 800; color: #1a202c; }
    .mod-card p  { margin: 0; font-size: 0.82rem; color: #718096; line-height: 1.5; flex: 1; }
    .mod-link { font-size: 0.82rem; font-weight: 700; color: #3182ce; margin-top: 4px; }
    .admin-card .mod-link { color: #744210; }
    .mod-badge { position: absolute; top: 12px; right: 12px; padding: 3px 9px; border-radius: 8px; font-size: 0.68rem; font-weight: 700; background: #dbeafe; color: #1d4ed8; }
    .mod-badge.admin { background: #fef9c3; color: #854d0e; }

    .info-card {
      margin: 2rem 2rem 0;
      background: linear-gradient(135deg, #1a365d, #2b6cb0);
      border-radius: 14px; padding: 1.5rem 2rem;
      display: flex; align-items: center; gap: 1.2rem; color: white; flex-wrap: wrap;
    }
    .info-icon { font-size: 2rem; flex-shrink: 0; }
    .info-card h4 { margin: 0 0 4px; font-size: 1rem; }
    .info-card p  { margin: 0; font-size: 0.78rem; opacity: 0.8; flex: 1; }
    .info-btn { padding: 9px 20px; background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.25); border-radius: 9px; text-decoration: none; font-size: 0.85rem; font-weight: 700; transition: all 0.2s; white-space: nowrap; }
    .info-btn:hover { background: rgba(255,255,255,0.25); }
  `]
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}