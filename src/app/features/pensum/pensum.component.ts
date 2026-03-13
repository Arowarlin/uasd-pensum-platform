import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CalculadoraService, TotalesCarrera } from '../../core/services/calculadora.service';
import { Carrera, Semestre, Modalidad } from '../../core/models/pensum.models';

@Component({
  selector: 'app-pensum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (cargando) {
      <div class="loading">
        <div class="spinner"></div>
        <p>Cargando pensum...</p>
      </div>
    }

    @if (!cargando && !carrera) {
      <div class="error">
        <h3>❌ No se pudo cargar el pensum</h3>
        <p>Verifica que el archivo JSON existe en public/assets/data/</p>
      </div>
    }

    @if (!cargando && carrera) {
      <div class="pensum-header">
        <div class="header-top">
          <div>
            <div class="fac-tag">{{ carrera.facultad }} · {{ carrera.escuela }}</div>
            <h2>{{ carrera.nombre }}</h2>
            <div class="meta">Plan: {{ carrera.plan }} &nbsp;|&nbsp; Código: {{ carrera.codigo }}</div>
          </div>
          <div class="sel-box">
            <div class="sel-group">
              <label>Modalidad</label>
              <select [(ngModel)]="modalidadSeleccionada" (change)="recalcular()">
                <option value="presencial">Presencial</option>
                <option value="semipresencial">Semipresencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div class="sel-group">
              <label>Nivel</label>
              <select [(ngModel)]="carrera.nivel" (change)="recalcular()">
                <option value="tecnico">Técnico</option>
                <option value="grado">Grado</option>
                <option value="postgrado">Postgrado</option>
              </select>
            </div>
          </div>
        </div>

        @if (totales) {
          <div class="totales-strip">
            <div class="tb"><span class="tv">{{ totales.CR }}</span><span class="tl">Créditos</span></div>
            <div class="tb"><span class="tv">{{ totales.HT }}</span><span class="tl">HT Presencial</span></div>
            <div class="tb"><span class="tv">{{ totales.HP }}</span><span class="tl">HP Presencial</span></div>
            @if (modalidadSeleccionada !== 'presencial') {
              <div class="tb ac"><span class="tv">{{ totales.HIV }}</span><span class="tl">HIV Virtual</span></div>
              <div class="tb ac"><span class="tv">{{ totales.HPV }}</span><span class="tl">HPV Virtual</span></div>
              <div class="tb ac"><span class="tv">{{ totales.HI }}</span><span class="tl">HI Invest.</span></div>
            }
            <div class="tb hi"><span class="tv">{{ totales.totalGeneral }}</span><span class="tl">Total Horas</span></div>
          </div>
        }
      </div>

      @if (validacion) {
        <div class="validacion" [class.ok]="validacion.valido" [class.err]="!validacion.valido">
          <strong>{{ validacion.valido ? '✅ Pensum válido' : '⚠️ Requiere revisión' }}</strong>
          — Nivel: {{ getNivelLabel() }} | {{ validacion.creditos }} créditos
          | Rango: {{ validacion.limites.minCreditos }}–{{ validacion.limites.maxCreditos }}
          <ul>
            @for (msg of validacion.mensajes; track msg) {
              <li>{{ msg }}</li>
            }
          </ul>
        </div>
      }

      @for (sem of semestreCalculados; track sem.numero) {
        <div class="sem-block">
          <div class="sem-head" [class]="'c' + ((sem.numero - 1) % 6)">
            <span>{{ sem.nombre }}</span>
            <div class="sem-tots">
              <span>{{ sem.totalCreditos }} CR</span>
              <span>{{ sem.totalHT }} HT</span>
              <span>{{ sem.totalHP }} HP</span>
              @if (modalidadSeleccionada !== 'presencial') {
                <span class="v">{{ sem.totalHIV }} HIV</span>
                <span class="v">{{ sem.totalHI }} HI</span>
              }
            </div>
          </div>

          <table class="tabla">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Asignatura</th>
                <th>CR</th>
                <th>HT</th>
                <th>HP</th>
                @if (modalidadSeleccionada !== 'presencial') {
                  <th class="v">HIV</th>
                  @if (modalidadSeleccionada === 'virtual') {
                    <th class="v">HPV</th>
                  }
                  <th class="v">HI</th>
                }
                <th>Prerequisitos</th>
              </tr>
            </thead>
            <tbody>
              @for (asig of sem.asignaturas; track asig.clave) {
                <tr>
                  <td><code>{{ asig.clave }}</code></td>
                  <td class="nom">{{ asig.nombre }}</td>
                  <td class="cn"><span class="bcr">{{ asig.creditos }}</span></td>
                  <td class="cn">{{ getH(asig).HT }}</td>
                  <td class="cn">{{ getH(asig).HP }}</td>
                  @if (modalidadSeleccionada !== 'presencial') {
                    <td class="cn v">{{ getH(asig).HIV }}</td>
                    @if (modalidadSeleccionada === 'virtual') {
                      <td class="cn v">{{ getH(asig).HPV }}</td>
                    }
                    <td class="cn v">{{ getH(asig).HI }}</td>
                  }
                  <td class="pre">
                    @for (p of asig.prerequisitos; track p) {
                      <span class="bpre">{{ p }}</span>
                    }
                    @if (asig.prerequisitos.length === 0) {
                      <span class="none">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr class="tfoot">
                <td colspan="2"><strong>Totales semestre</strong></td>
                <td class="cn"><strong>{{ sem.totalCreditos }}</strong></td>
                <td class="cn"><strong>{{ sem.totalHT }}</strong></td>
                <td class="cn"><strong>{{ sem.totalHP }}</strong></td>
                @if (modalidadSeleccionada !== 'presencial') {
                  <td class="cn v"><strong>{{ sem.totalHIV }}</strong></td>
                  @if (modalidadSeleccionada === 'virtual') {
                    <td class="cn v"><strong>{{ sem.totalHPV }}</strong></td>
                  }
                  <td class="cn v"><strong>{{ sem.totalHI }}</strong></td>
                }
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      }

      @if (totales) {
        <div class="resumen">
          <h3>📊 Resumen Final de Carrera</h3>
          <div class="res-grid">
            <div class="ri"><span class="rv">{{ totales.CR }}</span><span class="rl">Créditos</span></div>
            <div class="ri"><span class="rv">{{ totales.HT }}</span><span class="rl">HT Pres.</span></div>
            <div class="ri"><span class="rv">{{ totales.HP }}</span><span class="rl">HP Pres.</span></div>
            <div class="ri v"><span class="rv">{{ totales.HIV }}</span><span class="rl">HIV Virtual</span></div>
            <div class="ri v"><span class="rv">{{ totales.HPV }}</span><span class="rl">HPV Virtual</span></div>
            <div class="ri v"><span class="rv">{{ totales.HI }}</span><span class="rl">HI Invest.</span></div>
            <div class="ri pres"><span class="rv">{{ totales.totalHorasPresenciales }}</span><span class="rl">Total Presencial</span></div>
            <div class="ri virt"><span class="rv">{{ totales.totalHorasVirtuales }}</span><span class="rl">Total Virtual</span></div>
            <div class="ri big"><span class="rv">{{ totales.totalGeneral }}</span><span class="rl">TOTAL GENERAL</span></div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .loading { text-align:center; padding:4rem; }
    .spinner { width:40px; height:40px; border:4px solid #e2e8f0; border-top-color:#2b6cb0; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .error { text-align:center; padding:3rem; color:#e53e3e; }

    .pensum-header { background:linear-gradient(135deg,#1a365d,#2b6cb0); color:white; padding:2rem; }
    .header-top { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; }
    .fac-tag { font-size:0.75rem; opacity:0.75; margin-bottom:0.4rem; text-transform:uppercase; letter-spacing:1px; }
    h2 { font-size:1.4rem; margin:0 0 0.3rem; }
    .meta { font-size:0.8rem; opacity:0.7; }
    .sel-box { display:flex; gap:1rem; flex-wrap:wrap; }
    .sel-group { display:flex; flex-direction:column; gap:4px; }
    .sel-group label { font-size:0.72rem; opacity:0.8; }
    .sel-group select { padding:6px 10px; border-radius:6px; border:none; background:rgba(255,255,255,0.15); color:white; font-size:0.88rem; }
    .sel-group select option { background:#1a365d; }

    .totales-strip { display:flex; gap:10px; flex-wrap:wrap; }
    .tb { background:rgba(255,255,255,0.12); padding:10px 14px; border-radius:8px; text-align:center; min-width:70px; }
    .tb.ac { background:rgba(99,179,237,0.25); }
    .tb.hi { background:rgba(255,255,255,0.25); }
    .tv { display:block; font-size:1.4rem; font-weight:800; }
    .tl { font-size:0.68rem; opacity:0.8; text-transform:uppercase; }

    .validacion { margin:1rem 1.5rem; padding:1rem 1.2rem; border-radius:8px; font-size:0.86rem; }
    .validacion.ok  { background:#f0fff4; border-left:4px solid #38a169; color:#276749; }
    .validacion.err { background:#fff5f5; border-left:4px solid #e53e3e; color:#742a2a; }
    .validacion ul { margin:0.5rem 0 0 1.2rem; line-height:1.9; }

    .sem-block { margin:1rem 1.5rem; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.08); }
    .sem-head { display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1.2rem; color:white; font-weight:600; font-size:0.9rem; }
    .c0{background:#2b6cb0;} .c1{background:#276749;} .c2{background:#2c7a7b;}
    .c3{background:#744210;} .c4{background:#702459;} .c5{background:#1a365d;}
    .sem-tots { display:flex; gap:8px; }
    .sem-tots span { background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:10px; font-size:0.78rem; }
    .sem-tots .v { background:rgba(99,179,237,0.35); }

    .tabla { width:100%; border-collapse:collapse; background:white; font-size:0.86rem; }
    .tabla th { background:#f7fafc; padding:8px 10px; text-align:left; border-bottom:2px solid #e2e8f0; font-size:0.75rem; text-transform:uppercase; color:#4a5568; }
    .tabla td { padding:8px 10px; border-bottom:1px solid #f0f4f8; vertical-align:middle; }
    .tabla tr:hover td { background:#f7fafc; }
    .tabla th.v, .tabla td.v { color:#2b6cb0; }
    .nom { font-weight:500; }
    .cn { text-align:center; }
    code { background:#ebf8ff; color:#2b6cb0; padding:2px 5px; border-radius:4px; font-size:0.76rem; }
    .bcr { background:#276749; color:white; padding:2px 8px; border-radius:10px; font-size:0.76rem; font-weight:700; }
    .bpre { background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:4px; font-size:0.72rem; margin-right:3px; display:inline-block; }
    .none { color:#a0aec0; }
    .pre { min-width:150px; }
    .tfoot td { background:#f0f4f8; border-top:2px solid #e2e8f0; }

    .resumen { margin:1.5rem; background:white; border-radius:12px; padding:1.5rem; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
    .resumen h3 { margin:0 0 1.2rem; color:#1a365d; }
    .res-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px; }
    .ri { background:#f7fafc; border-radius:8px; padding:1rem; text-align:center; }
    .ri.v { background:#ebf8ff; }
    .ri.pres { background:#f0fff4; }
    .ri.virt { background:#e6fffa; }
    .ri.big { background:#1a365d; grid-column:span 2; }
    .rv { display:block; font-size:1.6rem; font-weight:800; color:#2b6cb0; }
    .ri.big .rv { color:#63b3ed; font-size:2rem; }
    .rl { font-size:0.68rem; color:#718096; text-transform:uppercase; }
    .ri.big .rl { color:rgba(255,255,255,0.7); }
  `]
})
export class PensumComponent implements OnInit {
  carrera: Carrera | null = null;
  cargando = true;
  modalidadSeleccionada: Modalidad = 'presencial';
  semestreCalculados: Semestre[] = [];
  totales: TotalesCarrera | null = null;
  validacion: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private calc: CalculadoraService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || 'informatica';
    this.http.get<Carrera>(`assets/data/${id}.json`).subscribe({
      next: (data) => {
        this.carrera = data;
        this.modalidadSeleccionada = data.modalidad;
        this.cargando = false;
        this.recalcular();
      },
      error: (err) => {
        console.error('Error cargando JSON:', err);
        this.cargando = false;
      }
    });
  }

  recalcular() {
    if (!this.carrera) return;
    this.carrera.modalidad = this.modalidadSeleccionada;
    this.semestreCalculados = this.carrera.semestres.map(s =>
      this.calc.calcularTotalesSemestre(s, this.modalidadSeleccionada)
    );
    this.totales = this.calc.calcularTotalesCarrera(this.carrera);
    this.validacion = this.calc.validarCarrera(this.carrera);
  }

  getH(asig: any) {
    return this.calc.calcularHorasAsignatura(asig, this.modalidadSeleccionada);
  }

  getNivelLabel() {
    const l: any = { tecnico:'Técnico', grado:'Grado', postgrado:'Postgrado' };
    return l[this.carrera?.nivel || 'grado'];
  }
}