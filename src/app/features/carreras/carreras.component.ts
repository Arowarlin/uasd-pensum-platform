import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>🎓 Carreras Disponibles</h2>
        <p>Selecciona una carrera para ver su plan de estudios</p>
      </div>
      <div class="cards">
        @for (c of carreras; track c.id) {
          <div class="card">
            <div class="card-top" [style.background]="c.color">
              <div class="fac">{{ c.facultad }}</div>
              <span class="nivel">{{ c.nivelLabel }}</span>
            </div>
            <div class="card-body">
              <h3>{{ c.nombre }}</h3>
              <p>{{ c.escuela }}</p>
              <div class="stats">
                <span>📚 {{ c.creditos }} CR</span>
                <span>📅 {{ c.semestres }} sem</span>
                <span>⏱ {{ c.totalHT }} HT</span>
              </div>
              <span class="mod" [class]="c.modalidad">{{ c.modalidadLabel }}</span>
            </div>
            <div class="card-foot">
              <a [routerLink]="['/pensum', c.id]" class="btn-ver">Ver Plan de Estudios →</a>
            </div>
          </div>
        }
      </div>
      <div class="nota">
        <strong>💡</strong> Puedes cambiar la modalidad dentro del plan de estudios
        para recalcular las horas automáticamente.
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1100px; margin:0 auto; padding:2rem; }
    .page-header { margin-bottom:2rem; }
    .page-header h2 { font-size:1.8rem; color:#1a365d; }
    .page-header p { color:#718096; }
    .cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.5rem; }
    .card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); transition:transform 0.2s; }
    .card:hover { transform:translateY(-4px); }
    .card-top { padding:1.2rem; color:white; display:flex; justify-content:space-between; align-items:flex-start; }
    .fac { font-size:0.78rem; opacity:0.9; }
    .nivel { background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:10px; font-size:0.72rem; }
    .card-body { padding:1.2rem; }
    h3 { font-size:1rem; color:#1a365d; margin-bottom:0.3rem; }
    p { color:#718096; font-size:0.82rem; margin-bottom:0.8rem; }
    .stats { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:0.8rem; }
    .stats span { background:#f7fafc; padding:3px 10px; border-radius:10px; font-size:0.78rem; }
    .mod { display:inline-block; padding:3px 12px; border-radius:10px; font-size:0.75rem; font-weight:600; }
    .mod.presencial { background:#f0fff4; color:#276749; }
    .mod.semipresencial { background:#ebf8ff; color:#2b6cb0; }
    .mod.virtual { background:#faf5ff; color:#553c9a; }
    .card-foot { padding:1rem 1.2rem; border-top:1px solid #f0f4f8; }
    .btn-ver { display:block; text-align:center; background:#2b6cb0; color:white; padding:8px; border-radius:8px; text-decoration:none; font-size:0.88rem; font-weight:600; }
    .btn-ver:hover { background:#2c5282; }
    .nota { margin-top:2rem; background:#fffbeb; border:1px solid #fbd38d; padding:1rem 1.2rem; border-radius:8px; font-size:0.88rem; color:#744210; }
  `]
})
export class CarrerasComponent {
  carreras = [
    {
      id: 'informatica',
      nombre: 'Licenciatura en Informática',
      facultad: 'Facultad de Ciencias',
      escuela: 'Escuela de Informática',
      creditos: 186, semestres: 9, totalHT: 135,
      modalidad: 'presencial', modalidadLabel: 'Presencial',
      nivel: 'grado', nivelLabel: 'Grado',
      color: 'linear-gradient(135deg,#1a365d,#2b6cb0)'
    }
  ];
}