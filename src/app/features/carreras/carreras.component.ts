import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="carreras-wrap">

      <div class="page-header">
        <div class="ph-left">
          <h2>🏫 Carreras UASD</h2>
          <p>Facultad de Ciencias — Escuela de Informatica</p>
        </div>
        <div class="ph-stats">
          <span>{{ carreras.length }} carrera(s) disponible(s)</span>
        </div>
      </div>

      <div class="cards-grid">
        @for (c of carreras; track c.id) {
          <div class="carrera-card" [class.featured]="c.featured">
            <div class="card-top" [style.background]="c.color">
              <div class="card-icon">{{ c.icon }}</div>
              <div class="card-badges">
                <span class="cbadge nivel">{{ c.nivel }}</span>
                <span class="cbadge modal">{{ c.modalidad }}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="card-code">{{ c.codigo }}</div>
              <h3>{{ c.nombre }}</h3>
              <p class="card-fac">{{ c.facultad }} · {{ c.escuela }}</p>
              <div class="card-stats">
                <div class="cstat">
                  <span class="cstat-v">{{ c.creditos }}</span>
                  <span class="cstat-l">Creditos</span>
                </div>
                <div class="cstat">
                  <span class="cstat-v">{{ c.semestres }}</span>
                  <span class="cstat-l">Semestres</span>
                </div>
                <div class="cstat">
                  <span class="cstat-v">{{ c.plan }}</span>
                  <span class="cstat-l">Plan</span>
                </div>
              </div>
              <div class="card-footer">
                <a [routerLink]="['/pensum', c.id]" class="btn-ver">
                  📋 Ver Pensum
                </a>
                <span class="estado" [class]="c.estado.toLowerCase()">
                  {{ c.estado === 'VALIDADO' ? '✓ Validado' : '⏳ Borrador' }}
                </span>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="coming-soon">
        <div class="cs-icon">🚀</div>
        <h4>Mas carreras proximamente</h4>
        <p>Actualmente el sistema tiene registrada la Licenciatura en Informatica. Se iran agregando mas carreras del catalogo UASD.</p>
      </div>

    </div>
  `,
  styles: [`
    .carreras-wrap { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }

    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1.8rem; flex-wrap: wrap; gap: 0.8rem;
    }
    .ph-left h2 { margin: 0; font-size: 1.5rem; color: #1a365d; }
    .ph-left p  { margin: 4px 0 0; color: #718096; font-size: 0.85rem; }
    .ph-stats { background: #ebf8ff; color: #2b6cb0; padding: 6px 16px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; }

    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1.5rem; margin-bottom: 2rem; }

    .carrera-card {
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: all 0.25s; background: white;
      border: 2px solid transparent;
    }
    .carrera-card:hover { transform: translateY(-5px); box-shadow: 0 12px 35px rgba(0,0,0,0.15); border-color: #3182ce; }
    .carrera-card.featured { border-color: #3182ce; }

    .card-top {
      padding: 1.8rem 1.5rem 1.3rem;
      display: flex; justify-content: space-between; align-items: flex-start;
    }
    .card-icon { font-size: 2.8rem; }
    .card-badges { display: flex; flex-direction: column; gap: 5px; align-items: flex-end; }
    .cbadge { padding: 3px 10px; border-radius: 10px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
    .cbadge.nivel  { background: rgba(255,255,255,0.25); color: white; }
    .cbadge.modal  { background: rgba(255,255,255,0.18); color: rgba(255,255,255,0.9); }

    .card-body { padding: 1.2rem 1.5rem 1.5rem; }
    .card-code { font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #2b6cb0; background: #ebf8ff; padding: 2px 8px; border-radius: 5px; display: inline-block; margin-bottom: 6px; }
    .card-body h3 { margin: 0 0 4px; font-size: 1.05rem; font-weight: 800; color: #1a202c; line-height: 1.3; }
    .card-fac { font-size: 0.76rem; color: #718096; margin: 0 0 1rem; }

    .card-stats { display: flex; gap: 0; margin-bottom: 1.2rem; background: #f8fafc; border-radius: 10px; overflow: hidden; }
    .cstat { flex: 1; padding: 10px 8px; text-align: center; border-right: 1px solid #e2e8f0; }
    .cstat:last-child { border-right: none; }
    .cstat-v { display: block; font-size: 1.1rem; font-weight: 800; color: #1a365d; }
    .cstat-l { display: block; font-size: 0.62rem; color: #94a3b8; text-transform: uppercase; margin-top: 1px; }

    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .btn-ver { background: linear-gradient(135deg, #1a365d, #3182ce); color: white; padding: 9px 18px; border-radius: 9px; text-decoration: none; font-size: 0.85rem; font-weight: 700; transition: all 0.2s; }
    .btn-ver:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(49,130,206,0.4); }
    .estado { padding: 4px 11px; border-radius: 10px; font-size: 0.73rem; font-weight: 700; }
    .estado.validado { background: #dcfce7; color: #166534; }
    .estado.borrador { background: #fef9c3; color: #854d0e; }

    .coming-soon { text-align: center; padding: 2.5rem; background: #f8fafc; border-radius: 14px; border: 2px dashed #cbd5e0; }
    .cs-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .coming-soon h4 { margin: 0 0 6px; color: #1a365d; }
    .coming-soon p  { margin: 0; color: #718096; font-size: 0.85rem; }
  `]
})
export class CarrerasComponent {
  carreras = [
    {
      id: 'informatica',
      codigo: '40601-INFO',
      nombre: 'Licenciatura en Informatica',
      facultad: 'Facultad de Ciencias',
      escuela: 'Escuela de Informatica',
      nivel: 'Grado',
      modalidad: 'Presencial',
      creditos: 186,
      semestres: 9,
      plan: '200820',
      estado: 'VALIDADO',
      color: 'linear-gradient(135deg, #1a365d, #2b6cb0)',
      icon: '💻',
      featured: true
    }
  ];
}
