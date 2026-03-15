import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-wrap">
      <div class="admin-header">
        <div>
          <h2>🛠️ Panel de Administración</h2>
          <p>UASD — Sistema de Gestión de Pensum Académico</p>
        </div>
        <div class="admin-info">
          <span class="role-badge admin">ADMIN</span>
          <span>{{ auth.usuario?.nombre }}</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card blue">
          <span class="stat-icon">📚</span>
          <span class="stat-val">1</span>
          <span class="stat-lbl">Carreras registradas</span>
        </div>
        <div class="stat-card green">
          <span class="stat-icon">📋</span>
          <span class="stat-val">9</span>
          <span class="stat-lbl">Semestres (Informática)</span>
        </div>
        <div class="stat-card purple">
          <span class="stat-icon">🎓</span>
          <span class="stat-val">186</span>
          <span class="stat-lbl">Créditos totales</span>
        </div>
        <div class="stat-card orange">
          <span class="stat-icon">👥</span>
          <span class="stat-val">3</span>
          <span class="stat-lbl">Usuarios del sistema</span>
        </div>
      </div>

      <div class="sections-grid">
        <div class="section-card">
          <h3>📂 Carreras Disponibles</h3>
          <div class="carrera-item">
            <div class="carrera-info">
              <span class="carrera-code">40601-INFO</span>
              <span class="carrera-nom">Licenciatura en Informática</span>
              <span class="carrera-meta">Plan 200820 · 186 CR · 9 semestres</span>
            </div>
            <div class="carrera-actions">
              <a routerLink="/pensum/informatica" class="btn-sm blue">Ver Pensum</a>
              <span class="badge validado">✓ VALIDADO</span>
            </div>
          </div>
          <div class="empty-msg">
            <p>💡 Para agregar más carreras, crea un nuevo archivo JSON en <code>public/assets/data/</code></p>
          </div>
        </div>

        <div class="section-card">
          <h3>👥 Usuarios del Sistema</h3>
          <table class="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Matrícula</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              @for (u of usuarios; track u.id) {
                <tr>
                  <td>{{ u.nombre }}</td>
                  <td><code>{{ u.matricula }}</code></td>
                  <td>
                    <span class="badge" [class]="u.role">
                      {{ u.role === 'admin' ? '🔑 Admin' : '🎓 Estudiante' }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="quick-actions">
        <h3>⚡ Acciones Rápidas</h3>
        <div class="actions-grid">
          <a routerLink="/pensum/informatica" class="action-btn">
            <span>📋</span> Ver Pensum Informática
          </a>
          <a routerLink="/carreras" class="action-btn">
            <span>🏫</span> Ver Todas las Carreras
          </a>
          <a routerLink="/calculadora" class="action-btn">
            <span>🧮</span> Calculadora de Horas
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-wrap { max-width:1100px; margin:0 auto; padding:2rem 1.5rem; }
    .admin-header {
      display:flex; justify-content:space-between; align-items:center;
      background:linear-gradient(135deg,#1a365d,#2b6cb0); color:white;
      padding:1.5rem 2rem; border-radius:14px; margin-bottom:1.5rem;
      flex-wrap:wrap; gap:1rem;
    }
    .admin-header h2 { margin:0; font-size:1.4rem; }
    .admin-header p { margin:0.3rem 0 0; opacity:0.8; font-size:0.85rem; }
    .admin-info { display:flex; align-items:center; gap:0.8rem; }

    .role-badge { padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; }
    .role-badge.admin { background:#f6e05e; color:#744210; }

    .stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; margin-bottom:1.5rem; }
    .stat-card {
      padding:1.4rem; border-radius:12px; display:flex; flex-direction:column;
      align-items:center; text-align:center; gap:4px; color:white;
      box-shadow:0 4px 15px rgba(0,0,0,0.1);
    }
    .stat-card.blue   { background:linear-gradient(135deg,#2b6cb0,#3182ce); }
    .stat-card.green  { background:linear-gradient(135deg,#276749,#38a169); }
    .stat-card.purple { background:linear-gradient(135deg,#553c9a,#805ad5); }
    .stat-card.orange { background:linear-gradient(135deg,#c05621,#dd6b20); }
    .stat-icon { font-size:1.8rem; }
    .stat-val { font-size:2rem; font-weight:800; }
    .stat-lbl { font-size:0.75rem; opacity:0.9; text-transform:uppercase; }

    .sections-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
    @media(max-width:700px) { .sections-grid { grid-template-columns:1fr; } }
    .section-card { background:white; border-radius:12px; padding:1.5rem; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
    .section-card h3 { margin:0 0 1.2rem; color:#1a365d; font-size:1rem; }

    .carrera-item { display:flex; justify-content:space-between; align-items:center; padding:1rem; background:#f7fafc; border-radius:10px; flex-wrap:wrap; gap:0.8rem; }
    .carrera-info { display:flex; flex-direction:column; gap:3px; }
    .carrera-code { font-family:monospace; font-size:0.75rem; color:#2b6cb0; background:#ebf8ff; padding:2px 6px; border-radius:4px; width:fit-content; }
    .carrera-nom { font-weight:600; color:#2d3748; font-size:0.9rem; }
    .carrera-meta { font-size:0.75rem; color:#718096; }
    .carrera-actions { display:flex; align-items:center; gap:0.6rem; }
    .btn-sm { padding:5px 14px; border-radius:7px; font-size:0.8rem; font-weight:600; text-decoration:none; }
    .btn-sm.blue { background:#2b6cb0; color:white; }
    .empty-msg { margin-top:1rem; padding:0.8rem; background:#fffbeb; border-radius:8px; font-size:0.8rem; color:#744210; }
    .empty-msg code { background:#fef3c7; padding:1px 5px; border-radius:3px; }

    .badge { padding:3px 10px; border-radius:10px; font-size:0.75rem; font-weight:600; }
    .badge.validado { background:#c6f6d5; color:#276749; }
    .badge.admin { background:#fed7aa; color:#c05621; }
    .badge.estudiante { background:#bee3f8; color:#2b6cb0; }

    .users-table { width:100%; border-collapse:collapse; font-size:0.85rem; }
    .users-table th { text-align:left; padding:8px 10px; border-bottom:2px solid #e2e8f0; font-size:0.75rem; color:#718096; text-transform:uppercase; }
    .users-table td { padding:8px 10px; border-bottom:1px solid #f0f4f8; }
    .users-table code { background:#ebf8ff; color:#2b6cb0; padding:1px 5px; border-radius:3px; font-size:0.78rem; }

    .quick-actions h3 { margin:0 0 1rem; color:#1a365d; }
    .actions-grid { display:flex; gap:1rem; flex-wrap:wrap; }
    .action-btn {
      padding:12px 20px; background:white; border:2px solid #e2e8f0; border-radius:10px;
      text-decoration:none; color:#2d3748; font-size:0.88rem; font-weight:600;
      display:flex; align-items:center; gap:8px; transition:all 0.2s;
    }
    .action-btn:hover { border-color:#2b6cb0; color:#2b6cb0; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.1); }
  `]
})
export class AdminComponent {
  usuarios = [
    { id:'1', nombre:'Administrador UASD', matricula:'admin', role:'admin' },
    { id:'2', nombre:'Arowarlin Suárez Díaz', matricula:'100679806', role:'estudiante' },
    { id:'3', nombre:'Juan Pérez', matricula:'100000001', role:'estudiante' },
  ];
  constructor(public auth: AuthService) {}
}